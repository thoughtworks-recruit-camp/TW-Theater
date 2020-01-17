import {ajax} from "./ajax.js";

const API_ROOT = "http://localhost:8888";
const $movieTitle = document.getElementById("movie-title");
const $movieInfoImg = document.getElementById("movie-info-img");
const $movieInfoContent = document.getElementById("movie-info-content");
const $moviePlot = document.getElementById("movie-plot");
const $movieRecommended = document.getElementById("movie-recommended");
const $movieInfoPhotos = document.getElementById("movie-info-photos");

function getLocationId() {
  return window.location.search.split("=")[1];
}

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

function renderDetails(obj) {
  $movieTitle.innerHTML = isCommonName(obj.title, obj.original_title) + " " + obj.year;
  $movieInfoImg.setAttribute("src", obj.image);
  $movieInfoContent.innerHTML += `<span id="info-content-genres">`
  + `类型: ` + `${updateArr(obj.genres)}</span>`
  + `<span id="info-content-pubdates">`
  + `上映日期: <br/>` + `${updateArr(obj.pubdates)}</span>`
  + `<span id="info-content-durations">`
  + `片长: ` + `${updateArr(obj.durations)}</span>`
  + `<span id="info-content-scores">`
  + `豆瓣评分: ` + `${obj.score}</span>`;
  $movieInfoPhotos.innerHTML +=
    `<div class="photo-header">`
    + `<h2>剧照</h2>`
    + ` <p><a href="${obj.album}">>查看更多<</a></p>`
    + ` </div>`;
  for (let photo of obj.photos) {
    $movieInfoPhotos.innerHTML +=
      `<div class="photo-container">`
      + `<img src="${photo}" width="160px"/></div>`
  }
  $moviePlot.innerHTML = obj.summary;
  let recommendeds = obj.recommended;
  $movieRecommended.innerHTML = "";
  for (let i = 0; i < recommendeds.length; i++) {
    $movieRecommended.innerHTML += `<div class="recommended">`
      + `<a href="./details.html?id=${recommendeds[i].id}">`
      + `<img src="${recommendeds[i].image}" alt="poster" width="160px" height="240px"/></a>`
      + `<p class="recommended-name"><a href="./details.html?id=${recommendeds[i].id}">`
      + `${recommendeds[i].title}</a></p>`
      + `</div>`
  }
}

function isCommonName(name1, name2) {
  if (name1 === name2) {
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
  document.referrer="";
};