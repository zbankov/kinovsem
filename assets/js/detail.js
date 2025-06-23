"use strict";

import { api_key, imageBaseURL, fetchDataFromServer } from "./api.js";
import { sidebar } from "./sidebar.js";
import { search } from "./search.js";

const movieId = window.localStorage.getItem("movieId");
const pageContent = document.querySelector("[page-content]");

sidebar();

const getGenres = function (genreList) {
  const newGenreList = [];
  for (const { name } of genreList) newGenreList.push(name);
  return newGenreList.join(", ");
};

const getCasts = function (castList) {
  const newCastList = [];
  for (let i = 0, len = castList.length; i < len && i < 10; i++) {
    const { name } = castList[i];
    newCastList.push(name);
  }
  return newCastList.join(", ");
};

const getDirectors = function (crewList) {
  const directors = crewList.filter(({ job }) => job === "Director");
  const directorList = [];
  for (const { name } of directors) directorList.push(name);
  return directorList.join(", ");
};

fetchDataFromServer(
  `https://api.themoviedb.org/3/movie/${movieId}?api_key=${api_key}&append_to_response=casts,videos,images,releases`,
  function (movie) {
    const {
      backdrop_path,
      poster_path,
      title,
      release_date,
      runtime,
      vote_average,
      releases: {
        countries: [{ certification } = { certification: "N/A" }],
      },
      genres,
      overview,
      casts: { cast, crew },
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
        <div class="detail-content">
          <h1 class="heading">${title}</h1>

          <div class="meta-list">
            <div class="meta-item">
              <img src="./assets/images/star.png" width="20" height="20" alt="rating">
              <span class="span">${vote_average.toFixed(1)}</span>
            </div>
            <div class="separator"></div>
            <div class="meta-item">${runtime}m</div>
            <div class="separator"></div>
            <div class="meta-item">${release_date?.split("-")[0] ?? "Not Released"}</div>
            <div class="meta-item card-badge">${certification}</div>
          </div>
          `;

fetch("./assets/players.json")
  .then((res) => res.json())
  .then((players) => {
    const iframeURL = players[movieId];

    const videoBox = document.createElement("div");
    videoBox.className = "video-box";
    videoBox.innerHTML = `
      <h3 class="title">Смотреть онлайн</h3>
      ${iframeURL
        ? `<iframe src="${iframeURL}" width="100%" height="480" allowfullscreen loading="lazy" style="border-radius:8px;border:none;"></iframe>`
        : `<p style="color:#ccc;">Плеер временно недоступен.</p>`}
    `;

    pageContent.querySelector(".detail-box").appendChild(videoBox);
  });

          <p class="genre">${getGenres(genres)}</p>
          <p class="overview">${overview}</p>

          <ul class="detail-list">
            <li class="list-item">
              <p class="list-name">Starring</p>
              <p>${getCasts(cast)}</p>
            </li>
            <li class="list-item">
              <p class="list-name">Directed By</p>
              <p>${getDirectors(crew)}</p>
            </li>
          </ul>
        </div>

        <div class="video-box">
          <h3 class="title">Смотреть онлайн</h3>
          <iframe
            src="https://example.com/embed/your-movie"
            frameborder="0"
            allowfullscreen
            width="100%"
            height="400px"
            style="border-radius: 8px; background: #000;">
          </iframe>
        </div>
      </div>
    `;

    pageContent.appendChild(movieDetail);
    search();
  }
);
