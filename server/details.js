
const $movieTitle = document.getElementById("movie-title");
const $movieInfoImg = document.getElementById("movie-info-img");
const $infoContentGenres = document.getElementById("info-content-genres");
const $infoContentPubdates = document.getElementById("info-content-pubdates");
const $infoContentDurations = document.getElementById("info-content-durations");
const $infoContentScores = document.getElementById("info-content-scores");
const $moviePlot = document.getElementById("movie-plot");

//get id from location, return id
function getLocationId() {
  let href = window.location.href;
  let index = href.indexOf("id=");
  return href.slice(index + 3);
}

//render details.html
function renderDetails(index) {
  $movieTitle.innerHTML = detailsData[index].title + detailsData[index].original_title;
  $movieInfoImg.setAttribute("src", detailsData[index].images.small);
  $infoContentGenres.innerHTML = "类型: " + detailsData[index].genres[0];
  $infoContentPubdates.innerHTML = "上映日期: " + detailsData[index].pubdates;
  $infoContentDurations.innerHTML = "片长: " + detailsData[index].durations;
  $infoContentScores.innerHTML = "豆瓣评分: " + detailsData[index].rating;
  $moviePlot.innerHTML = detailsData[index].summary;
}
