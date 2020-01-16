(function () {
  const $movieTitle = document.getElementById("movie-title");
  const $movieInfoImg = document.getElementById("movie-info-img");
  const $infoContentGenres = document.getElementById("info-content-genres");
  const $infoContentPubdates = document.getElementById("info-content-pubdates");
  const $infoContentDurations = document.getElementById("info-content-durations");
  const $infoContentScores = document.getElementById("info-content-scores");
  const $moviePlot = document.getElementById("movie-plot");

  //render details.html
  function renderDetails(obj) {
    $movieTitle.innerHTML = obj.title + obj.original_title;
    $movieInfoImg.setAttribute("src", obj.images.small);
    $infoContentGenres.innerHTML = "类型: " + obj.genres[0];
    $infoContentPubdates.innerHTML = "上映日期: " + obj.pubdates;
    $infoContentDurations.innerHTML = "片长: " + obj.durations;
    $infoContentScores.innerHTML = "豆瓣评分: " + obj.score;
    $moviePlot.innerHTML = obj.summary;
  }
})();