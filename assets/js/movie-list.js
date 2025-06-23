
'use strict';

import { sidebar } from "./sidebar.js";
import { fetchDataFromServer } from "./api.js";
import { createMovieCard } from "./movie-card.js";

const movieList = document.querySelector("[movie-list]");

sidebar();

const urlParams = new URLSearchParams(window.location.search);
const genreId = urlParams.get("genreId");
const genreName = urlParams.get("genreName");

document.title = `${genreName} Movies - Tvflix`;

fetchDataFromServer(
  `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=true&language=en-US&page=1&sort_by=popularity.desc&with_genres=${genreId}`,
  function ({ results: movieListArray }) {
    for (const movie of movieListArray) {
      const movieCard = createMovieCard(movie);
      movieCard.querySelector("a").setAttribute("onclick", `localStorage.setItem('movieId', '${movie.id}')`);
      movieList.appendChild(movieCard);
    }
  }
);
