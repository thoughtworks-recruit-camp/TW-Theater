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
    + `<img src= alt="sorry" />`
    + `<p class="search-info">`
    + `<span class="info-title">美丽 (2008)</span>`
    + `<span>评分: 6.3</span>`
    + `<span>韩国 / 剧情 / Beautiful / 美丽 / 87分钟</span>`
    + `<span>全宰洪 / 车秀妍 / 李天熙</span>`
    + `</p>`
    + `</div>`
  }
}