const brain = require('brain.js');
const data = require('./data.json');

// flatten keywords into an array
const keywords = data.reduce((acc, val) => acc.concat(val.keywords), []);

// create a set of unique keywords
const uniqueKeywords = new Set(keywords);

// create a dictionary of keyword frequencies for each category
const keywordFrequencies = data.reduce((acc, val) => {
  const frequencies = {};
  uniqueKeywords.forEach(keyword => frequencies[keyword] = 0);
  val.keywords.forEach(keyword => frequencies[keyword] += 1);
  acc[val.name] = frequencies;
  return acc;
}, {});

// create training data
const trainingData = [];
data.forEach(category => {
  category.keywords.forEach(keyword => {
    const input = {};
    input[keyword] = 1;
    trainingData.push({
      input,
      output: { [category.name]: 1 }
    });
  });
});

// create neural network
const net = new brain.NeuralNetwork();

// train neural network
net.train(trainingData);

// test neural network
const testPhrase = "a funny comedy movie";
const output = net.run({ "funny": 1, "comedy": 1 });
console.log(output);


//TMDB 

const API_KEY = 'api_key=1cf50e6248dc270629e802686245c2c8';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?'+API_KEY;


// Function to get movies based on search query and predicted category
function getMovies(query) {
  // Use neural network to predict movie category based on query
  const input = {};
  const words = query.split(' ');
  words.forEach(word => {
    if (uniqueKeywords.has(word)) {
      input[word] = 1;
    }
  });
  const output = net.run(input);
  const predictedCategory = Object.keys(output).reduce((a, b) => output[a] > output[b] ? a : b);

  // Use predicted category to get movies from TMDB API
  const url = `${API_URL}&with_keywords=${keywordFrequencies[predictedCategory].id}`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      showMovies(data.results);
    });
}

function showMovies(data) {
  const main = document.getElementById('main');
  main.innerHTML = '';

  data.forEach(movie => {
    const { title, poster_path, vote_average, overview } = movie;
    const movieEl = document.createElement('div');
    movieEl.classList.add('movie');
    movieEl.innerHTML = `
      <img src="${IMG_URL + poster_path}" alt="${title}">
      <div class="movie-info">
        <h3>${title}</h3>
        <span class="${getClassByRate(vote_average)}">${vote_average}</span>
      </div>
      <div class="overview">
        <h3>Overview</h3>
        ${overview}
      </div>
    `;

    main.appendChild(movieEl);
  });
}

function getClassByRate(vote) {
  if (vote >= 8) {
    return 'green';
  } else if (vote >= 5) {
    return 'orange';
  } else {
    return 'red';
  }
}

getMovies("funny comedy movie");
// const genres = [
//     {
//       "id": 28,
//       "name": "Action"
//     },
//     {
//       "id": 12,
//       "name": "Adventure"
//     },
//     {
//       "id": 16,
//       "name": "Animation"
//     },
//     {
//       "id": 35,
//       "name": "Comedy"
//     },
//     {
//       "id": 80,
//       "name": "Crime"
//     },
//     {
//       "id": 99,
//       "name": "Documentary"
//     },
//     {
//       "id": 18,
//       "name": "Drama"
//     },
//     {
//       "id": 10751,
//       "name": "Family"
//     },
//     {
//       "id": 14,
//       "name": "Fantasy"
//     },
//     {
//       "id": 36,
//       "name": "History"
//     },
//     {
//       "id": 27,
//       "name": "Horror"
//     },
//     {
//       "id": 10402,
//       "name": "Music"
//     },
//     {
//       "id": 9648,
//       "name": "Mystery"
//     },
//     {
//       "id": 10749,
//       "name": "Romance"
//     },
//     {
//       "id": 878,
//       "name": "Science Fiction"
//     },
//     {
//       "id": 10770,
//       "name": "TV Movie"
//     },
//     {
//       "id": 53,
//       "name": "Thriller"
//     },
//     {
//       "id": 10752,
//       "name": "War"
//     },
//     {
//       "id": 37,
//       "name": "Western"
//     }
//   ]

const main = document.getElementById('main');
const form =  document.getElementById('form');
const search = document.getElementById('search');
const tagsEl = document.getElementById('tags');

const prev = document.getElementById('prev')
const next = document.getElementById('next')
const current = document.getElementById('current')

let currentPage = 1;
let nextPage = 2;
let prevPage = 3;
let lastUrl = '';
let totalPages = 100;

// let selectedGenre = []
// setGenre();
// function setGenre() {
//     tagsEl.innerHTML= '';
//     genres.forEach(genre => {
//         const t = document.createElement('div');
//         t.classList.add('tag');
//         t.id=genre.id;
//         t.innerText = genre.name;
//         t.addEventListener('click', () => {
//             if(selectedGenre.length == 0){
//                 selectedGenre.push(genre.id);
//             }else{
//                 if(selectedGenre.includes(genre.id)){
//                     selectedGenre.forEach((id, idx) => {
//                         if(id == genre.id){
//                             selectedGenre.splice(idx, 1);
//                         }
//                     })
//                 }else{
//                     selectedGenre.push(genre.id);
//                 }
//             }
//             console.log(selectedGenre)
//             getMovies(API_URL + '&with_genres='+encodeURI(selectedGenre.join(',')))
//             highlightSelection()
//         })
//         tagsEl.append(t);
//     })
// }

function highlightSelection() {
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.classList.remove('highlight')
    })
    clearBtn()
    if(selectedGenre.length !=0){   
        selectedGenre.forEach(id => {
            const hightlightedTag = document.getElementById(id);
            hightlightedTag.classList.add('highlight');
        })
    }

}

function clearBtn(){
    let clearBtn = document.getElementById('clear');
    if(clearBtn){
        clearBtn.classList.add('highlight')
    }else{
            
        let clear = document.createElement('div');
        clear.classList.add('tag','highlight');
        clear.id = 'clear';
        clear.innerText = 'Clear x';
        clear.addEventListener('click', () => {
            selectedGenre = [];
            setGenre();            
            getMovies(API_URL);
        })
        tagsEl.append(clear);
    }
    
}

getMovies(API_URL);

function getMovies(url) {
  lastUrl = url;
    fetch(url).then(res => res.json()).then(data => {
        console.log(data.results)
        if(data.results.length !== 0){
            showMovies(data.results);
            currentPage = data.page;
            nextPage = currentPage + 1;
            prevPage = currentPage - 1;
            totalPages = data.total_pages;

            current.innerText = currentPage;

            if(currentPage <= 1){
              prev.classList.add('disabled');
              next.classList.remove('disabled')
            }else if(currentPage>= totalPages){
              prev.classList.remove('disabled');
              next.classList.add('disabled')
            }else{
              prev.classList.remove('disabled');
              next.classList.remove('disabled')
            }

            tagsEl.scrollIntoView({behavior : 'smooth'})

        }else{
            main.innerHTML= `<h1 class="no-results">No Results Found</h1>`
        }
       
    })

}


function showMovies(data) {
    main.innerHTML = '';

    data.forEach(movie => {
        const {title, poster_path, vote_average, overview, id} = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
             <img src="${poster_path? IMG_URL+poster_path: "http://via.placeholder.com/1080x1580" }" alt="${title}">

            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>

            <div class="overview">

                <h3>Overview</h3>
                ${overview}
                <br/> 
                <button class="know-more" id="${id}">Know More</button
            </div>
        
        `

        main.appendChild(movieEl);

        document.getElementById(id).addEventListener('click', () => {
          console.log(id)
          openNav(movie)
        })
    })
}

const overlayContent = document.getElementById('overlay-content');
/* Open when someone clicks on the span element */
function openNav(movie) {
  let id = movie.id;
  fetch(BASE_URL + '/movie/'+id+'/videos?'+API_KEY).then(res => res.json()).then(videoData => {
    console.log(videoData);
    if(videoData){
      document.getElementById("myNav").style.width = "100%";
      if(videoData.results.length > 0){
        let embed = [];
        let dots = [];
        videoData.results.forEach((video, idx) => {
          let {name, key, site} = video

          if(site == 'YouTube'){
              
            embed.push(`
              <iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          
          `)

            dots.push(`
              <span class="dot">${idx + 1}</span>
            `)
          }
        })
        
        let content = `
        <h1 class="no-results">${movie.original_title}</h1>
        <br/>
        
        ${embed.join('')}
        <br/>

        <div class="dots">${dots.join('')}</div>
        
        `
        overlayContent.innerHTML = content;
        activeSlide=0;
        showVideos();
      }else{
        overlayContent.innerHTML = `<h1 class="no-results">No Results Found</h1>`
      }
    }
  })
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

let activeSlide = 0;
let totalVideos = 0;

function showVideos(){
  let embedClasses = document.querySelectorAll('.embed');
  let dots = document.querySelectorAll('.dot');

  totalVideos = embedClasses.length; 
  embedClasses.forEach((embedTag, idx) => {
    if(activeSlide == idx){
      embedTag.classList.add('show')
      embedTag.classList.remove('hide')

    }else{
      embedTag.classList.add('hide');
      embedTag.classList.remove('show')
    }
  })

  dots.forEach((dot, indx) => {
    if(activeSlide == indx){
      dot.classList.add('active');
    }else{
      dot.classList.remove('active')
    }
  })
}

const leftArrow = document.getElementById('left-arrow')
const rightArrow = document.getElementById('right-arrow')

leftArrow.addEventListener('click', () => {
  if(activeSlide > 0){
    activeSlide--;
  }else{
    activeSlide = totalVideos -1;
  }

  showVideos()
})

rightArrow.addEventListener('click', () => {
  if(activeSlide < (totalVideos -1)){
    activeSlide++;
  }else{
    activeSlide = 0;
  }
  showVideos()
})


function getColor(vote) {
    if(vote>= 8){
        return 'green'
    }else if(vote >= 5){
        return "orange"
    }else{
        return 'red'
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;
    selectedGenre=[];
    setGenre();
    if(searchTerm) {
        getMovies(searchURL+'&query='+searchTerm)
    }else{
        getMovies(API_URL);
    }

})

prev.addEventListener('click', () => {
  if(prevPage > 0){
    pageCall(prevPage);
  }
})

next.addEventListener('click', () => {
  if(nextPage <= totalPages){
    pageCall(nextPage);
  }
})

function pageCall(page){
  let urlSplit = lastUrl.split('?');
  let queryParams = urlSplit[1].split('&');
  let key = queryParams[queryParams.length -1].split('=');
  if(key[0] != 'page'){
    let url = lastUrl + '&page='+page
    getMovies(url);
  }else{
    key[1] = page.toString();
    let a = key.join('=');
    queryParams[queryParams.length -1] = a;
    let b = queryParams.join('&');
    let url = urlSplit[0] +'?'+ b
    getMovies(url);
  }
}

// const TMDB_API_KEY = "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=1cf50e6248dc270629e802686245c2c8";

// // Function to search for movies based on user input
// async function searchMovies(inputPhrase) {
//   const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${inputPhrase}`);
//   const data = await response.json();
//   const movies = data.results;
  
//   // Use neural network to classify movies based on category
//   for (let i = 0; i < movies.length; i++) {
//     const movie = movies[i];
//     const score = neuralNetwork.classify(movie.title, movie.release_date, movie.vote_average);
//     movie.score = score;
//   }
  
//   // Sort movies based on their scores
//   movies.sort((a, b) => b.score - a.score);
  
//   // Display top ten movies
//   const topTen = movies.slice(0, 10);
//   displayMovies(topTen);
// }

// // Function to display list of movies on the page
// function displayMovies(movies) {
//   const movieList = document.getElementById("movie-list");
//   movieList.innerHTML = "";
  
//   for (let i = 0; i < movies.length; i++) {
//     const movie = movies[i];
//     const title = movie.title;
//     const posterPath = movie.poster_path;
//     const releaseYear = movie.release_date.slice(0, 4);
//     const rating = movie.vote_average;
//     const score = movie.score;
    
//     const listItem = document.createElement("li");
//     const titleElement = document.createElement("h3");
//     const posterElement = document.createElement("img");
//     const releaseElement = document.createElement("p");
//     const ratingElement = document.createElement("p");
//     const scoreElement = document.createElement("p");
    
//     titleElement.innerText = title;
//     posterElement.src = `https://image.tmdb.org/t/p/w500/${posterPath}`;
//     releaseElement.innerText = `Released: ${releaseYear}`;
//     ratingElement.innerText = `Rating: ${rating}`;
//     scoreElement.innerText = `Category score: ${score}`;
    
//     listItem.appendChild(titleElement);
//     listItem.appendChild(posterElement);
//     listItem.appendChild(releaseElement);
//     listItem.appendChild(ratingElement);
//     listItem.appendChild(scoreElement);
    
//     movieList.appendChild(listItem);
//   }
// }
