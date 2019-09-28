const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://rickandmortyapi.com/api/character/';
let next_fetch = localStorage;
next_fetch.setItem('next_fetch', 'start');

const getData = api => {
  fetch(api)
    .then(response => response.json())
    .then(response => {
      next_fetch.setItem('next_fetch', response.info.next);
      
      const characters = response.results;
      let output = characters.map(character => {
        return `
      <article class="Card">
        <img src="${character.image}" />
        <h2>${character.name}<span>${character.species}</span></h2>
      </article>
    `
      }).join('');
      let newItem = document.createElement('section');
      newItem.classList.add('Items');
      newItem.innerHTML = output;
      $app.appendChild(newItem);
      if(next_fetch.getItem('next_fetch') == ''){
        killObserver();
      }
    })
    .catch(error => console.log(error));
}

async function loadData(){

  if(next_fetch.getItem('next_fetch') != 'start') {
    let response = await getData(next_fetch.getItem('next_fetch'));  
  }else{
    let response= await getData(API);
  }
}

const killObserver = () => {
  console.log('inicio');
  let newItem = document.createElement('h3');
  newItem.innerText = 'Ya no hay personajes...';
  $app.appendChild(newItem);
  intersectionObserver.disconnect();
  console.log('fin');
   
}

const intersectionObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    loadData();
  }

}, {
  rootMargin: '0px 0px 100% 0px',
});

intersectionObserver.observe($observe);