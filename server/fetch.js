const [http, EventEmitter] = [require("http"), require("events").EventEmitter];

const REMOTE_ROOT = "http://api.douban.com/v2/movie";
const KEY = "0df993c66c0c636e29ecbb5344252a4a";

const [moviesDb, imagesDb] = [new Map(), new Map()];
const dataChunks = [];
let summaryCount = 0;
let imageCount = 0;
let finishHandler = new EventEmitter();
let jobHandler = new EventEmitter();

for (let index = 0; index < 250; index += 10) {
  http.get(`${REMOTE_ROOT}/top250?start=${index}&count=10&apikey=${KEY}`, (res) => {
    let rawData = "";
    res.setEncoding("utf-8");
    res.on("data", (chunk => {
      rawData += chunk;
    }));
    res.on("end", () => mergeData(JSON.parse(rawData)));
  });
}

function mergeData(data) {
  dataChunks.push(data);
  process.stdout.write(`\rTop 250 basics loading progress: ${dataChunks.length * 10}/250`);
  if (dataChunks.length === 25) {
    process.stdout.write(" ...completed!\n");

    dataChunks.sort((a, b) => a.start - b.start);
    dataChunks.map(chunk => (chunk.subjects)).flat().forEach((element => moviesDb.set(element.id, element)));

    for (let id of moviesDb.keys()) {
      http.get(`${REMOTE_ROOT}/subject/${id}?apikey=${KEY}`, (res => {
        let rawData = "";
        res.setEncoding("utf-8");
        res.on("data", (chunk => {
          rawData += chunk;
        }));
        res.on("end", () => {
          moviesDb.get(id).summary = JSON.parse(rawData).summary;
          jobHandler.emit("summary");
        });
      }));

      http.get(moviesDb.get(id).images.large, res => {
        let data = Buffer.from([]);
        res.on("data", chunk => {
          data = Buffer.concat([data, chunk]);
        });
        res.on("end", () => {
          imagesDb.set(id, data);
          jobHandler.emit("image");
        });
      });
    }
  }
}

const detailsMessage = (summaryCount, imageCount) => {
  return `\rTop 250 details loading progress: summaries ${summaryCount}/250 | images ${imageCount}/250`;
};

jobHandler.on("summary", () => {
  process.stdout.write(detailsMessage(++summaryCount, imageCount));
  if (summaryCount === 250 && imageCount === 250) {
    process.stdout.write(" ...completed!\n");
    finishHandler.emit("finished");
  }
});
jobHandler.on("image", () => {
  process.stdout.write(detailsMessage(summaryCount, ++imageCount));
  if (summaryCount === 250 && imageCount === 250) {
    process.stdout.write(" ...completed!\n");
    finishHandler.emit("finished");
  }
});

module.exports = {finishHandler, moviesDb, imagesDb};
