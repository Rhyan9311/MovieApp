const brain = require('brain.js');
const fetch = require('node-fetch');

// The API endpoint for TMDB
const API_KEY = 'api_key=1cf50e6248dc270629e802686245c2c8';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY;

// Flatten keywords into an array
const keywords = [];

// Dictionary of keyword frequencies for each category
const keywordFrequencies = {};

// Create training data
const trainingData = [];

// Function to fetch movies from TMDB API
async function fetchMovies() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    const movies = data.results;

    // Loop through movies to collect data for training
    movies.forEach(movie => {
      const { title, vote_average, overview, genre_ids } = movie;

      // Fetch genres for each movie
      fetch(`${BASE_URL}/genre/movie/list?${API_KEY}`)
        .then(res => res.json())
        .then(data => {
          const genres = data.genres;

          // Loop through genres to create keyword frequencies
          genres.forEach(genre => {
            const { id, name } = genre;
            if (!keywordFrequencies[name]) {
              keywordFrequencies[name] = {};
            }
            genre_ids.forEach(genreId => {
              if (genreId === id) {
                keywords.push(name);
                if (!keywordFrequencies[name][title]) {
                  keywordFrequencies[name][title] = 1;
                } else {
                  keywordFrequencies[name][title]++;
                }
              }
            });
          });

          // Create training data for the movie
          const input = {};
          keywords.forEach(keyword => input[keyword] = keywordFrequencies[keyword][title] || 0);
          trainingData.push({
            input,
            output: { [title]: vote_average }
          });
        });
    });

    // Create neural network
    const net = new brain.recurrent.LSTM();

    // Train neural network
    net.train(trainingData, {
      iterations: 1000,
      log: true
    });

    // Test neural network
    const testPhrase = "an action movie with lots of explosions";
    const output = net.run(testPhrase);
    console.log(output);

  } catch (error) {
    console.log(error);
  }
}

fetchMovies();


/*
Execute the seed function, IF we ran this module directly (node seed).
Async functions always return a promise, so we can use catch to handle
any errors that might occur inside of seed.
*/
if (module === require.main) {
  runSeed();
}

// we export the seed function for testing purposes (see ./seed.spec.js)
module.exports = seed;