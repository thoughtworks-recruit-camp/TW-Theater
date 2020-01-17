import {ajax} from "../src/ajax.js";

const API_ROOT = "http://localhost:8888";
const sortingValuesMap = new Map([
  ["综合", "top"],
  ["随机", "random"]]);
let currentSorting = "top";
let currentGenre = "全部";
let currentLimit = 10;

function ajaxFailed(err) {
  console.log(err);
}

function getGalleryData() {
  ajax({
    url: `${API_ROOT}/movies?genre=${currentGenre}&sorting=${currentSorting}&limit=${currentLimit}`,
    method: "get",
    onSuccess: renderGallery,
    onFail: ajaxFailed
  })
}

function initGenres() {
  ajax({
    url: `${API_ROOT}/genres?top=10`,
    method: "get",
    onSuccess: renderGenres,
    onFail: ajaxFailed
  })
}

function renderGallery(dataList) {
  let contents = document.querySelector("#contents");
  while (contents.hasChildNodes()) {
    contents.removeChild(contents.lastChild);
  }
  dataList.map(data => {
    let movieTile = document.createElement("article");
    movieTile.setAttribute("class", "movie-tile");
    movieTile.innerHTML
      = `<img src="http://localhost:8888/poster?id=${data.id}" alt="${data.title}" width="200px" height="300px">`
      + `<span class="rating-tag">豆瓣评分: ${data.rating}</span>`
      + `<div class="brief-box">`
      + `<ul><li>类型: ${data.genres.join(" ")}</li>`
      + `<li>年代: ${data.year}</li>`
      + `<li><p>${data.summary.replace("\n","")}</p></li></ul>`
      + `<a class="details-button" href="#">查看详情</a></div>`
      + `<a href="#">`
      + `<h3>${data.title}</h3>`
      + `</a>`;
    contents.appendChild(movieTile);
  })
}

function renderGenres(dataList) {
  let genresList = document.querySelector("#genres-list");
  while (genresList.hasChildNodes()) {
    genresList.removeChild(genresList.lastChild);
  }
  genresList.innerHTML += `<li class="selected"><span class="iconfont icon-tags selected-icon"></span>全部</li>`;
  dataList.map(data => {
    genresList.innerHTML += `<li class="unselected"><span class="iconfont icon-tag"></span>${data}</li>`;
  });
  genresList.addEventListener("click", handleGenreSwitch, false);
}

function handleSortingSwitch(event) {
  let target = event.target;
  if (target.tagName !== "LI") {
    return;
  }
  let selectedSorting = sortingValuesMap.get(target.innerText);
  if (selectedSorting !== currentSorting) {
    for (let child of target.parentElement.children) {
      child.classList.replace("selected","unselected");
    }
    target.classList.replace("unselected","selected");
    currentSorting = selectedSorting;
    getGalleryData();
  }
  getGalleryData();
}

function handleGenreSwitch(event) {
  let target = event.target;
  if (target.tagName !== "LI") {
    return;
  }
  let selectedGenre = target.innerText;
  if (selectedGenre !== currentGenre) {
    for (let child of target.parentElement.children) {
      child.classList.replace("selected","unselected");
    }
    target.classList.replace("unselected","selected");
    currentGenre = selectedGenre;
    getGalleryData();
  }
}

window.onload = () => {
  initGenres();
  getGalleryData();
  let sortingOptions = document.querySelector("#sorting-options");
  sortingOptions.addEventListener("click", handleSortingSwitch, false);
  let limitSelect = document.querySelector("#limit-select");
  limitSelect.onchange = () => {
    currentLimit = limitSelect.value;
    getGalleryData();
  }
};