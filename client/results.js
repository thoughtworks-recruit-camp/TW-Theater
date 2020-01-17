import {ajax} from "../src/ajax.js";

const API_ROOT = "http://localhost:8888";
const $main = document.getElementById("main");

//get keyword from location
function getLocationKeyword() {
  return window.location.search.split("=")[1];
}
console.log(getLocationKeyword())

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
  console.log(1)
  $main.innerHTML = `<h1>搜索` + `${getLocationKeyword()}</h1>`;
  for (let i = 0; i < arr.length; i++) {
    $main.innerHTML += `<div class="search-div">`
    + `<a href="./details.html?id=${arr[i].id}">`
    + `<img src=${arr[i].image} alt="poster" /></a>`
    + `<p class="search-info">`
    + `<span class="info-title"><a href="./details.html?id=${arr[i].id}">`
    + `${arr[i].title} (${arr[i].year})</a></span>`
    + `<span>评分: ${arr[i].rating}</span>`
    + `<span>${updateArr(arr[i].genres)} / `
    + `${isCommonName(arr[i].title, arr[i].original_title)}</span>`
    + `<span>${updateArr(arr[i].casts)}</span>`
    + `<span class="search-summary">${arr[i].summary}</span>`
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