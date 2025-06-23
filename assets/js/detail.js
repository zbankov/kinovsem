
"use strict";

import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";

const movieId = window.localStorage.getItem("movieId");
const pageContent = document.querySelector("[page-content]");

fetchDataFromServer(
  `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&language=ru-RU`,
  function (movie) {
    const {
      backdrop_path,
      poster_path,
      title,
      release_date,
      runtime,
      vote_average,
      genres,
      overview,
    } = movie;

    document.title = `${title} - Tvflix`;

    const movieDetail = document.createElement("div");
    movieDetail.classList.add("movie-detail");

    movieDetail.innerHTML = `
      <div class="backdrop-image" style="background-image: url('${imageBaseURL}w1280${backdrop_path || poster_path}')"></div>

      <figure class="poster-box movie-poster">
        <img src="${imageBaseURL}w342${poster_path}" alt="${title} poster" class="img-cover">
      </figure>

      <div class="detail-box">
        <h1 class="heading">${title}</h1>
        <div class="meta-list">
          <div class="meta-item">
            <img src="./assets/images/star.png" width="20" height="20" alt="rating">
            <span class="span">${vote_average.toFixed(1)}</span>
          </div>
          <div class="separator"></div>
          <div class="meta-item">${runtime} мин</div>
          <div class="separator"></div>
          <div class="meta-item">${release_date}</div>
          <div class="separator"></div>
          <div class="meta-item">${genres.map(g => g.name).join(", ")}</div>
        </div>
        <p class="overview">${overview}</p>
      </div>
    `;

    pageContent.appendChild(movieDetail);

    // Вставка плеера из players.json
    fetch("./assets/players.json")
      .then((res) => res.json())
      .then((players) => {
        const iframeURL = players[movieId];
        const iframeBox = document.createElement("div");
        iframeBox.className = "video-box";
        iframeBox.innerHTML = iframeURL
          ? \`<h3 class="title">Смотреть онлайн</h3>
             <iframe src="\${iframeURL}" width="100%" height="480" allowfullscreen loading="lazy" style="border:none;border-radius:8px;margin-top:16px;"></iframe>\`
          : "<p style='margin-top:16px;color:#ccc'>Плеер временно недоступен.</p>";
        pageContent.appendChild(iframeBox);
      });
  }
);
