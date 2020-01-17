const [http, url] = [require("http"), require('url')];
const fetch = require("./fetch");

const REMOTE_ROOT = "http://api.douban.com/v2/movie";
const KEY = "0df993c66c0c636e29ecbb5344252a4a";

const HOST = "localhost";
const PORT = 8888;
const API_ROOT = `http://${HOST}:${PORT}`;

const DATA_SOURCE = fetch;  // TODO fetch || load
const genreIdMap = new Map();
let moviesDb, imagesDb;

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

function isInTitle(keyword, subject) {
  let lowerCase = keyword.toLowerCase();
  return subject.title.toLowerCase().includes(lowerCase)
    || subject.original_title.toLowerCase().includes(lowerCase);
}

function toIndexData(dbData) {
  return {
    id: dbData.id,
    title: dbData.title,
    rating: dbData.rating.average.toFixed(1),
    genres: dbData.genres,
    year: dbData.year,
    image: `${API_ROOT}/poster?id=${dbData.id}`,
    summary: dbData.summary
  }
}

function toDetailsData(dbData) {
  return {
    "title": dbData.title,
    "original_title": dbData.original_title,
    "year": dbData.year,
    "image": `${API_ROOT}/poster?id=${dbData.id}`,
    "genres": dbData.genres,
    "pubdates": dbData.pubdates,
    "durations": dbData.durations,
    "score": dbData.rating.average.toFixed(1),
    "photos": dbData.photos,
    "album": `https://movie.douban.com/subject/${dbData.id}/all_photos`,
    "summary": dbData.summary,
    "recommended":
      getRandomElements(dbData.genres.slice(0, 3).map(genre => genreIdMap.get(genre)).flat(), 6).map(id => moviesDb.get(id)).map(dbData => toRecommendData(dbData))
  };
}

function toRecommendData(dbData) {
  return {
    id: dbData.id,
    title: dbData.title,
    image: `${API_ROOT}/poster?id=${dbData.id}`
  }
}

function toSearchData(dbData) {
  return {
    id: dbData.id,
    title: dbData.title,
    original_title: dbData.original_title,
    image: `${API_ROOT}/poster?id=${dbData.id}`,
    genres: dbData.genres,
    year: dbData.year,
    summary: dbData.summary,
    rating: dbData.rating.average.toFixed(1),
    duration: dbData.duration,
    casts: dbData.casts.map(cast => cast.name)
  }
}


DATA_SOURCE.finishHandler.on("finished", () => {
  moviesDb = DATA_SOURCE.moviesDb;
  imagesDb = DATA_SOURCE.imagesDb;
  Array.from(moviesDb.entries())
    .forEach(([key, value]) => {
      for (let genre of value.genres) {
        if (!genreIdMap.has(genre)) {
          genreIdMap.set(genre, [])
        }
        genreIdMap.get(genre).push(key);
      }
    });
  const proxyServer = http.createServer((request, response) => {
      const parsedUrl = url.parse(request.url, true);
      response.setHeader('Access-Control-Allow-Origin', '*');
      response.setHeader('Access-Control-Allow-Methods', '*');
      response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      switch (parsedUrl.pathname) {
        case
        "/movies"
        : {
          let [genre, sorting, limit]
            = [parsedUrl.query.genre, parsedUrl.query.sorting, Number(parsedUrl.query.limit)];
          let resData =
            genre === "全部" ?
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
        case
        "/details"
        : {
          let id = parsedUrl.query.id;
          http.get(`${REMOTE_ROOT}/subject/${id}?apikey=${KEY}`, (res) => {
            let rawData = "";
            res.setEncoding("utf-8");
            res.on("data", (chunk => {
              rawData += chunk;
            }));
            res.on("end", () => {
              response.statusCode = 200;
              response.setHeader('Content-Type', 'Application/JSON');
              response.end(JSON.stringify(toDetailsData(moviesDb.get(id))));
            });
          });
          break;
        }
        case
        "/poster"
        : {
          response.statusCode = 200;
          response.setHeader("Cache-Control", "max-age=3600");
          response.end(imagesDb.get(parsedUrl.query.id));
          break;
        }
        case
        "/search"
        : {
          let resData = Array.from(moviesDb.values()).filter(subject => isInTitle(parsedUrl.query.keyword, subject));
          response.statusCode = 200;
          response.setHeader('Content-Type', 'Application/JSON');
          response.end(JSON.stringify(resData.map(toSearchData)));
          break;
        }
        case
        "/genres"
        : {
          let count = parsedUrl.query.top;
          response.statusCode = 200;
          response.setHeader('Content-Type', 'Application/JSON');
          response.end(JSON.stringify(Array.from(genreIdMap.keys())
            .sort(((a, b) => genreIdMap.get(b).length - genreIdMap.get(a).length))
            .slice(0, count)));
          break;
        }
      }
    }
  );
  proxyServer.listen(PORT, () => {
    console.log(`The DB Server is running at ${API_ROOT}`);
  });
});



