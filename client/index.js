import {ajax} from "../src/ajax.js";

const API_ROOT = "http://localhost:8888";

function ajaxFailed(err) {
  console.log(err);
}

function initGallery() {
  ajax({
    url: `${API_ROOT}/movies/random?count=16`,
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
      = `<a href="#">`
      + `<img src="http://localhost:8888/poster?id=${data.id}" alt="${data.title}" width="200px" height="300px">`
      + `</a>`
      + `<span class="rating-tag">豆瓣评分: ${data.rating}</span>`
      + `<span class="genre-tag">${data.firstGenre}</span>`
      + `<a href="#">`
      + `<h3>${data.title}</h3>`
      + ` </a>`;
    contents.appendChild(movieTile);
  })
}

function renderGenres(dataList) {
  let genresList = document.querySelector("#genres-list");
  while (genresList.hasChildNodes()) {
    genresList.removeChild(genresList.lastChild);
  }
  dataList.map(data => {
    genresList.innerHTML += `<li>${data}</li>`;
  });
}

window.onload = () => {
  initGallery();
  initGenres();
};