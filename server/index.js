const http = require('http');
const url = require('url');
const API_ROOT = '/topMovies';
const DB_ROOT = 'http://localhost:3000';
const MAX_RANDOM_N = 36;
let DATA;
let idPosterMap;
http.get(`${DB_ROOT}${API_ROOT}`, res => {
  let body = '';
  res.on('data', data => {
    body += data;
  });
  res.on('end', () => {
    DATA = JSON.parse(body);
    idPosterMap = new Map(DATA.map(entry => [entry.id, entry.images.large]));
  });
}).on('error', error => {
  console.log('代理失败:' + error.message)
});


const proxyServer = http.createServer((request, response) => {
  const parsedUrl = url.parse(request.url, true);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', '*');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Content-Type', 'text/plain;charset=utf-8');
  switch (parsedUrl.pathname) {
    case "/topMovies/all":
      response.statusCode = 200;
      response.end(JSON.stringify(DATA));
      break;
    case "/topMovies/random":
      let count = Number(parsedUrl.query.count);
      if (count > MAX_RANDOM_N) {
        response.statusCode = 413;
        response.end("CODE: 413");
      }
      let randomIndices = new Set();
      const MAX = DATA.length;
      while (randomIndices.size < count) {
        randomIndices.add(Math.floor(Math.random() * MAX));
      }
      let randomSubjects = Array.from(randomIndices).map(index => DATA[index]);
      response.statusCode = 200;
      response.end(JSON.stringify(randomSubjects.reduce((acc, cur) => {
        acc.push([{
          title: cur.title,
          rating: cur.rating.average,
          firstGenre: cur.genres[0],
          year: cur.year,
          image: cur.images.large
        }]);
        return acc;
      }, [])));
      break;
    case "/topMovies/poster":
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