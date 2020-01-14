let http = require("http");
let fs = require("fs");
let topMovies = [];
for (let index = 0; index < 250; index += 10) {
  http.get(`http://api.douban.com/v2/movie/top250?start=${index}&count=10&apikey=0df993c66c0c636e29ecbb5344252a4a`, (res) => {
    res.setEncoding("utf-8");
    let rawData = "";
    res.on("data", (chunk => {
      rawData += chunk;
    }));
    res.on("end", () => mergeData(JSON.parse(rawData)))
});
}

function mergeData(dataFrac) {
  topMovies = topMovies.concat(dataFrac);
  if (topMovies.length === 25) {
    topMovies.sort((a, b) => a.start - b.start);
    let topMoviesDb = {topMovies: topMovies.map(raw => raw.subjects).flat()};
    fs.writeFileSync("./db.json",JSON.stringify(topMoviesDb));
  }
}
