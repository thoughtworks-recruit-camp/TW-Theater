let [http, EventEmitter] = [require("http"), require("events").EventEmitter];
let finishHandler = new EventEmitter();
let jobHandler = new EventEmitter();
let chunkCount = 0;
let summaryCount = 0;
let imageCount = 0;


const [moviesDb, imagesDb] = [new Map(), new Map()];
const dataChunks = [];

for (let index = 0; index < 250; index += 10) {
  http.get(`http://api.douban.com/v2/movie/top250?start=${index}&count=10&apikey=0df993c66c0c636e29ecbb5344252a4a`, (res1) => {
    let rawData = "";
    res1.setEncoding("utf-8");
    res1.on("data", (chunk => {
      rawData += chunk;
    }));
    res1.on("end", () => mergeData(JSON.parse(rawData)));
  });
}

function mergeData(data) {
  dataChunks.push(data);
  process.stdout.write(`\rTop 250 basics loading progress: ${++chunkCount * 10}/250`);
  if (dataChunks.length === 25) {
    process.stdout.write(" ...completed!\n");
    dataChunks.sort((a, b) => a.start - b.start);
    dataChunks.map(chunk => (chunk.subjects)).flat().forEach((element => moviesDb.set(element.id, element)));
    for (let id of moviesDb.keys()) {
      http.get(`http://api.douban.com/v2/movie/subject/${id}?apikey=0df993c66c0c636e29ecbb5344252a4a`, (res => {
        let rawData = "";
        res.setEncoding("utf-8");
        res.on("data", (chunk => {
          rawData += chunk;
        }));
        res.on("end", () => {
          let currentData = moviesDb.get(id);
          currentData.summary = JSON.parse(rawData).summary;
          moviesDb.set(id, currentData);
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
          jobHandler.emit("image")
        });
      });

    }
  }
}

jobHandler.on("summary", () => {
  process.stdout.write(`\rTop 250 details loading progress: summaries ${++summaryCount}/250 | images ${imageCount}/250`);
  if (summaryCount === 250 && imageCount === 250) {
    process.stdout.write(" ...completed!\n");
    finishHandler.emit("finished");
  }
});
jobHandler.on("image", () => {
  process.stdout.write(`\rTop 250 details loading progress: summaries ${summaryCount}/250 | images ${++imageCount}/250`);
  if (summaryCount === 250 && imageCount === 250) {
    process.stdout.write(" ...completed!\n");
    finishHandler.emit("finished");
  }
});

module.exports = {finishHandler, moviesDb, imagesDb};
