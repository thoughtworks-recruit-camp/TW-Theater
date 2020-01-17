import {ajax} from "../src/ajax.js";

const API_ROOT = "http://localhost:8888";
const $movieTitle = document.getElementById("movie-title");
const $movieInfoImg = document.getElementById("movie-info-img");
const $infoContentGenres = document.getElementById("info-content-genres");
const $infoContentPubdates = document.getElementById("info-content-pubdates");
const $infoContentDurations = document.getElementById("info-content-durations");
const $infoContentScores = document.getElementById("info-content-scores");
const $moviePlot = document.getElementById("movie-plot");
const $movieRecommended = document.getElementById("movie-recommended");

let obj = {
  "id": "1292052",
  "title": "肖申克的救赎",
  "original_title": "The Shawshank Redemption",
  "year": "1994",
  "image": "http://img3.doubanio.com/view/photo/s_ratio_poster/public/p480747492.jpg",
  "genres": [
    "犯罪",
    "剧情"
  ],
  "pubdates": [
    "1994-09-10(多伦多电影节)",
    "1994-10-14(美国)"
  ],
  "durations": [
    "142分钟"
  ],
  "score": 9.7,
  "summary": `20世纪40年代末，小有成就的青年银行家安迪（蒂姆·罗宾斯 Tim Robbins 饰）因涉嫌杀害妻子及她的情人而锒铛入狱。
  在这座名为肖申克的监狱内，希望似乎虚无缥缈，终身监禁的惩罚无疑注定了安迪接下来灰暗绝望的人生。未过多久，安
  迪尝试接近囚犯中颇有声望的瑞德（摩根·弗里曼 Morgan Freeman 饰），请求对方帮自己搞来小锤子。以此为契机，二
  人逐渐熟稔，安迪也仿佛在鱼龙混杂、罪恶横生、黑白混淆的牢狱中找到属于自己的求生之道。他利用自身的专业知识，
  帮助监狱管理层逃税、洗黑钱，同时凭借与瑞德的交往在犯人中间也渐渐受到礼遇。表面看来，他已如瑞德那样对那堵高
  墙从憎恨转变为处之泰然，但是对自由的渴望仍促使他朝着心中的希望和目标前进。而关于其罪行的真相，似乎更使这一
  切朝前推进了一步……`,
  "recommended": [
    {
      "id": "1291546",
      "title": "霸王别姬",
      "images": "http://img3.doubanio.com/view/photo/s_ratio_poster/public/p2561716440.jpg"
    },
    {
      "id": "1292720",
      "title": "阿甘正传",
      "images": "http://img9.doubanio.com/view/photo/s_ratio_poster/public/p1484728154.jpg"
    },
    {
      "id": "1295644",
      "title": "这个杀手不太冷",
      "images": "http://img3.doubanio.com/view/photo/s_ratio_poster/public/p511118051.jpg"
    },
    {
      "id": "1292063",
      "title": "美丽人生",
      "images": "http://img3.doubanio.com/view/photo/s_ratio_poster/public/p2578474613.jpg"
    },
    {
      "id": "1292722",
      "title": "泰坦尼克号",
      "images": "http://img9.doubanio.com/view/photo/s_ratio_poster/public/p457760035.jpg"
    },
    {
      "id": "1291561",
      "title": "千与千寻",
      "images": "http://img1.doubanio.com/view/photo/s_ratio_poster/public/p2557573348.jpg"
    }
  ]
};

//get id from location, return id
function getLocationId() {
  return window.location.search.split("=")[1];
}

//get API by id
function ajaxFailed(err) {
  console.log(err);
}

function getDetailsDataFromId() {
  ajax({
    url: `${API_ROOT}/details?id=${getLocationId()}`,
    method: "get",
    onSuccess: renderDetails,
    onFail: ajaxFailed
  })
}

//render details.html
function renderDetails(obj) {
  $movieTitle.innerHTML = isCommonName(obj.title, obj.original_title) + " " + obj.year;
  $movieInfoImg.setAttribute("src", obj.image);
  $infoContentGenres.innerHTML = "类型: " + updateArr(obj.genres);
  $infoContentPubdates.innerHTML = "上映日期: " + updateArr(obj.pubdates);
  $infoContentDurations.innerHTML = "片长: " + updateArr(obj.durations);
  $infoContentScores.innerHTML = "豆瓣评分: " + obj.score;
  $moviePlot.innerHTML = obj.summary;
  let recommendeds = obj.recommended;
  $movieRecommended.innerHTML = "";
  for (let i = 0; i < recommendeds.length; i++) {
    $movieRecommended.innerHTML += `<div class="recommended">`
      + `<img src="${recommendeds[i].image}" alt="sorry" />`
      + `<span class="recommended-name">${recommendeds[i].title}</span>`
      + `</div>`
  }
}

//update
function isCommonName(name1, name2) {
  if(name1 === name2) {
    return name1;
  }
  return name1 + " " + name2;
}

function updateArr(arr) {
  let res = "";
  for (let i = 0; i < arr.length - 1; i++) {
    res += arr[i] + " / ";
  }
  return res + arr[arr.length - 1];
}

window.onload = () => {
  getDetailsDataFromId();
  console.log(1)
};