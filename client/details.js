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
const $movieInfoPhotos = document.getElementById("movie-info-photos");

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

//update
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
};