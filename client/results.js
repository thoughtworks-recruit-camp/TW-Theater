import {ajax} from "../src/ajax.js";

const $main = document.getElementById("main");

function getLocationKeyword() {
  return window.location.search.split("=")[1];
}

//get API by keyword
function ajaxFailed(err) {
    console.log(err);
  }
  
function getResultsDataFromKeyword() {
  ajax({
    url: `${API_ROOT}/search?keyword=${getLocationKeyword()}`,
    method: "get",
    onSuccess: renderResults,
    onFail: ajaxFailed
  })
}
  
//render results.html
function renderResults(arr) {
  $main.innerHTML = `搜索 ${getLocationKeyword()}`;
  for (let i = 0; i < arr.length; i++) {
    $main.innerHTML += `<div class="search-div">`
    + `<a href="./details.html?id=${arr[i].id}">`
    + `<img src=${arr[i].images} alt="poster" /></a>`
    + `<p class="search-info">`
    + `<span class="info-title"><a href="./details.html?id=${arr[i].id}">`
    + `${arr[i].title} (${arr[i].year})</a></span>`
    + `<span>评分: ${arr[i].score}</span>`
    + `<span>${updateArr(arr[i].genres)} / `
    + `${isCommonName(arr[i].title, arr[i].original_title)} /`
    + `${arr[i].durations[0]}</span>`
    + `<span>全宰洪 / 车秀妍 / 李天熙</span>`
    + `${arr[i].summary}`
    + `</p>`
    + `</div>`
  }
}

function updateArr(arr) {
  let res = "";
  for (let i = 0; i < arr.length - 1; i++) {
    res += arr[i] + " / ";
  }
  return res + arr[arr.length - 1];
}

function isCommonName(name1, name2) {
  if (name1 === name2) {
    return name1;
  }
  return name1 + " / " + name2;
}

window.onload = () => {
  getResultsDataFromKeyword();
};