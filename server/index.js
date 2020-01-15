const [http, url] = [require("http"), require('url')];
const fetch = require("./fetch");
const MAX_RANDOM_N = 36;
const idPosterMap = new Map();
const METHOD = fetch;  // TODO fetch || load

function toIndexData(dbData) {
  return {
    title: dbData.title,
    rating: dbData.rating.average,
    firstGenre: dbData.genres[0],
    year: dbData.year,
    image: dbData.images.large
  }
}

METHOD.handler.on("finished", () => {
  const moviesDb = METHOD.data;
  Array.from(moviesDb.entries())
    .forEach(([key, value]) => idPosterMap.set(key, value.images.large));
  const proxyServer = http.createServer((request, response) => {
    const parsedUrl = url.parse(request.url, true);
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', '*');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    // response.setHeader('Content-Type', 'Application/JSON');
    switch (parsedUrl.pathname) {
      case "/movies/top": {
        let count = Number(parsedUrl.query.count);
        if (count > MAX_RANDOM_N) {
          response.statusCode = 413;
          response.end(JSON.stringify({CODE: 413}));
        }
        response.statusCode = 200;
        response.end(JSON.stringify(Array.from(moviesDb.values()).slice(0, count).map(toIndexData)));
        break;
      }
      case "/movies/random":
        let count = Number(parsedUrl.query.count);
        if (count > MAX_RANDOM_N) {
          response.statusCode = 413;
          response.end("CODE: 413");
        }
        let randomIndices = new Set();
        const MAX = moviesDb.size;
        while (randomIndices.size < count) {
          randomIndices.add(Math.floor(Math.random() * MAX));
        }
        let randomSubjects = Array.from(randomIndices).map(index => Array.from(moviesDb.values())[index]);
        response.statusCode = 200;
        response.end(JSON.stringify(randomSubjects.map(toIndexData)));
        break;
      case "/poster":
        http.get(idPosterMap.get(parsedUrl.query.id), res => {
          let body = Buffer.from([]);
          res.on("data", data => {
            body = Buffer.concat([body, data]);
          });
          res.on("end", () => {
            response.statusCode = 200;
            response.end(body);
          })
        });
    }
  });
  proxyServer.listen(8888, () => {
    console.log('The proxyServer is running at http://localhost:8888');
  });
});


