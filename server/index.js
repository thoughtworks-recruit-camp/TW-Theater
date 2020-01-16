const [http, url] = [require("http"), require('url')];
const fetch = require("./fetch");
const MAX_RANDOM_N = 36;
const idPosterMap = new Map();
const genreIdMap = new Map();
const METHOD = fetch;  // TODO fetch || load

function getRandomElements(array, count) {
  let arr = array.concat();
  let result = [];
  for (let index = 0; index < count; index++) {
    let randomIndex = Math.floor(Math.random() * (arr.length - index));
    result.push(arr[randomIndex]);
    arr[randomIndex] = arr[arr.length - index - 1];
  }
  return result
}

function toIndexData(dbData) {
  return {
    id: dbData.id,
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
    .forEach(([key, value]) => {
      idPosterMap.set(key, value.images.large);
      for (let genre of value.genres) {
        let currentIds = genreIdMap.get(genre) || [];
        genreIdMap.set(genre, currentIds.concat(key))
      }
    });
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
        response.setHeader('Content-Type', 'Application/JSON');
        response.end(JSON.stringify(Array.from(moviesDb.values()).slice(0, count).map(toIndexData)));
        break;
      }
      case "/movies/random":
        let count = Number(parsedUrl.query.count);
        if (count > MAX_RANDOM_N) {
          response.statusCode = 413;
          response.end("CODE: 413");
        }
        let randomSubjects = getRandomElements(Array.from(moviesDb.values()), count);
        response.statusCode = 200;
        response.setHeader('Content-Type', 'Application/JSON');
        response.end(JSON.stringify(randomSubjects.map(toIndexData)));
        break;
      case "/movies/genre": {
        let [genre, sorting, count]
          = [parsedUrl.query.genre, parsedUrl.query.sorting, Number(parsedUrl.query.count)];
        if (count > MAX_RANDOM_N) {
          response.statusCode = 413;
          response.end(JSON.stringify({CODE: 413}));
        }
        let resData;
        if (sorting === "top") {
          resData = genreIdMap.get(genre).slice(0, count).map(id => moviesDb.get(id)).map(toIndexData);
        } else if (sorting === "random") {
          resData = getRandomElements(genreIdMap.get(genre), count).map(id => moviesDb.get(id)).map(toIndexData);
        }
        response.statusCode = 200;
        response.setHeader('Content-Type', 'Application/JSON');
        response.end(JSON.stringify(resData));
        break;
      }
      case "/details": {
        let id = parsedUrl.query.id;
        http.get(`http://api.douban.com/v2/movie/subject/${id}?apikey=0df993c66c0c636e29ecbb5344252a4a`, (res) => {
          let rawData = "";
          res.setEncoding("utf-8");
          res.on("data", (chunk => {
            rawData += chunk;
          }));
          res.on("end", () => {
            let detailData = JSON.parse(rawData);
            let briefData = moviesDb.get(id);
            let resData = {
              "title": briefData.title,
              "original_title": briefData.original_title,
              "year": briefData.year,
              "images": briefData.images,
              "genres": briefData.genres,
              "pubdates": briefData.pubdates,
              "durations": briefData.durations,
              "score": briefData.rating.average,
              "summary": detailData.summary,
              "recommended": [
                1, 2, 3, 4, 5
              ]
            };
            response.statusCode = 200;
            response.setHeader('Content-Type', 'Application/JSON');
            response.end(JSON.stringify(resData));
          });
        });
        break;
      }
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


