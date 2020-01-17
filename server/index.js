const [http, url] = [require("http"), require('url')];
const fetch = require("./fetch");
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

function toRecItems(dbData) {
  return {
    id: dbData.id,
    title: dbData.title,
    image: `http://localhost:8888/poster?id=${dbData.id}`
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
      case "/movies" : {
        let [genre, sorting, limit]
          = [parsedUrl.query.genre, parsedUrl.query.sorting, Number(parsedUrl.query.limit)];
        let resData =
          genre === "all" ?
            Array.from(moviesDb.values())
            : genreIdMap.get(genre).map(id => moviesDb.get(id));
        if (sorting === "top") {
          resData =
            limit === 0 ?
              resData
              : resData.slice(0, limit);
        } else if (sorting === "random") {
          resData =
            limit === 0 ?
              getRandomElements(resData, resData.length)
              : getRandomElements(resData, limit);
        }
        response.statusCode = 200;
        response.setHeader('Content-Type', 'Application/JSON');
        response.end(JSON.stringify(resData.map(toIndexData)));
        break;
      }
      // case
      // "/movies/top"
      // : {
      //   let count = Number(parsedUrl.query.count);
      //   if (count > MAX_RANDOM_N) {
      //     response.statusCode = 413;
      //     response.end(JSON.stringify({CODE: 413}));
      //   }
      //   response.statusCode = 200;
      //   response.setHeader('Content-Type', 'Application/JSON');
      //   response.end(JSON.stringify(Array.from(moviesDb.values()).slice(0, count).map(toIndexData)));
      //   break;
      // }
      // case
      // "/movies/random"
      // :
      //   let count = Number(parsedUrl.query.count);
      //   if (count > MAX_RANDOM_N) {
      //     response.statusCode = 413;
      //     response.end("CODE: 413");
      //   }
      //   let randomSubjects = getRandomElements(Array.from(moviesDb.values()), count);
      //   response.statusCode = 200;
      //   response.setHeader('Content-Type', 'Application/JSON');
      //   response.end(JSON.stringify(randomSubjects.map(toIndexData)));
      //   break;
      // case        "/movies/genre"      : {
      //   let [genre, sorting, count]
      //     = [parsedUrl.query.genre, parsedUrl.query.sorting, Number(parsedUrl.query.count)];
      //   if (count > MAX_RANDOM_N) {
      //     response.statusCode = 413;
      //     response.end(JSON.stringify({CODE: 413}));
      //   }
      //   let resData;
      //   if (sorting === "top") {
      //     resData = genreIdMap.get(genre).slice(0, count).map(id => moviesDb.get(id)).map(toIndexData);
      //   } else if (sorting === "random") {
      //     resData = getRandomElements(genreIdMap.get(genre), count).map(id => moviesDb.get(id)).map(toIndexData);
      //   }
      //   response.statusCode = 200;
      //   response.setHeader('Content-Type', 'Application/JSON');
      //   response.end(JSON.stringify(resData));
      //   break;
      // }
      case "/details"   : {
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
              "images": idPosterMap.get(id),
              "genres": briefData.genres,
              "pubdates": briefData.pubdates,
              "durations": briefData.durations,
              "score": briefData.rating.average,
              "summary": detailData.summary,
              "recommended":
                getRandomElements(briefData.genres.map(genre => genreIdMap.get(genre)).flat(), 6).map(id => moviesDb.get(id)).map(dbData => toRecItems(dbData))

            };
            response.statusCode = 200;
            response.setHeader('Content-Type', 'Application/JSON');
            response.end(JSON.stringify(resData));
          });
        });
        break;
      }
      case      "/genres"      : {
        let count = parsedUrl.query.top;
        response.statusCode = 200;
        response.setHeader('Content-Type', 'Application/JSON');
        response.end(JSON.stringify(Array.from(genreIdMap.keys())
          .sort(((a, b) => genreIdMap.get(b).length - genreIdMap.get(a).length))
          .slice(0, count)));
        break;
      }
      case      "/poster": {
        http.get(idPosterMap.get(parsedUrl.query.id), res => {
          let body = Buffer.from([]);
          res.on("data", data => {
            body = Buffer.concat([body, data]);
          });
          res.on("end", () => {
            response.statusCode = 200;
            response.setHeader("Cache-Control", "max-age=60");
            response.end(body);
          });

        });
        break;

      }
    }
  });
  proxyServer.listen(8888, () => {
    console.log('The proxyServer is running at http://localhost:8888');
  });
})
;


