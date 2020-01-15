let [http, EventEmitter] = [require("http"), require("events").EventEmitter];
let handler = new EventEmitter();

const moviesDb = new Map();
const dataChunks = [];

for (let index = 0; index < 250; index += 10) {
  http.get(`http://api.douban.com/v2/movie/top250?start=${index}&count=10&apikey=0df993c66c0c636e29ecbb5344252a4a`, (res1) => {
    let rawData = "";
    res1.on("data", (chunk => {
      rawData += chunk;
    }));
    res1.on("end", () => mergeData(JSON.parse(rawData)));
  });
}

function mergeData(data) {
  dataChunks.push(data);
  if (dataChunks.length === 25) {
    dataChunks.sort((a, b) => a.start - b.start);
    dataChunks.map(chunk => (chunk.subjects)).flat().forEach((element => moviesDb.set(element.id,element)));
    handler.emit("finished")
  }
}

module.exports = {handler: handler, data: moviesDb};

// function getGenres(moviesDb) {
//   let genres = new Set();
//   for (let subject of moviesDb.topMovies) {
//     genres.add(...subject.genres);
//   }
//   for (let subject of moviesDb.inTheaters) {
//     genres.add(...subject.genres);
//   }
//   fs.writeFileSync(".\\genres.json", JSON.stringify(Array.from(genres), null, 2));
// }