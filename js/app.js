/*
 * Create a list that holds all of your cards
 */

const deck = document.querySelector('.deck');

function shuffleDeck() {
  const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
  const shuffledCards = shuffle(cardsToShuffle);
  for (card of shuffledCards) {
    deck.appendChild(card);
  }
}

shuffleDeck();

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

let flippedCard = [];
let moves = 0;
let clockOff = true;
let time = 0;
let clockId;
let matched = 0;
const TOTAL_PAIRS = 8;



function validClick(clickedCard) {
    return (
      clickedCard.classList.contains('card') &&
      !clickedCard.classList.contains('match') &&
      flippedCard.length < 2 &&
      !flippedCard.includes(clickedCard)
    );
}

deck.addEventListener('click', event => {
  const clickedCard = event.target;
  if (validClick(clickedCard)) {
    if (clockOff) {
      startClock();
      clockOff = false;
    }
    toggledCard(clickedCard);
    addFlippedCard(clickedCard);
    if (flippedCard.length === 2) {
      checkMatch(clickedCard);
      addMove();
      score();
    }
  }
})

function toggledCard(clickedCard) {
  clickedCard.classList.toggle('open');
  clickedCard.classList.toggle('show');
}

function addFlippedCard(clickedCard) {
    flippedCard.push(clickedCard);
}

function toggledCard(card) {
    card.classList.toggle('open');
    card.classList.toggle('show');
}

function checkMatch () {
  if (
    flippedCard[0].firstElementChild.className ===
    flippedCard[1].firstElementChild.className
  ) {
    flippedCard[0].classList.toggle('match');
    flippedCard[1].classList.toggle('match');
    flippedCard = [];
    matched++;
  } else {
    setTimeout(() => {
      toggledCard(flippedCard[0]);
      toggledCard(flippedCard[1]);
      flippedCard = [];
    }, 1000);
  }
  if (matched === 8) {
    gameOver();
  }
}

function addMove () {
  moves++;
  const movesText = document.querySelector('.moves');
  movesText.innerHTML = moves;
}

function score() {
  if (moves === 12 || moves === 20
  ) { removeStar();
  }
}

function removeStar() {
  const starList = document.querySelectorAll('.stars li');
  for (star of starList) {
    if (star.style.display !== 'none') {
        star.style.display = 'none';
        break;
      }
  }
}

function startClock() {
  clockId = setInterval(() => {
    time++;
    displayTime();
    console.log(time);
  }, 1000);
}

function displayTime(){
	const clock = document.querySelector('.clock');
	const minutes = Math.floor(time / 60);
	const seconds = time % 60;

	if (seconds < 10) {
		clock.innerHTML = `${minutes}:0${seconds}`;
	}else{
		clock.innerHTML = `${minutes}:${seconds}`;
	}
}

function stopClock(){
	clearInterval (clockId);
}

function toggleModal(){
	const modal = document.querySelector('.modal__background');
	modal.classList.toggle('hide');
  modalStats();
}

function modalStats() {
    const timeStat = document.querySelector('.modal__time');
    const clockTime = document.getElementById('.clock').innerHTML;

    timeStat.innerHTML = 'Time = ${clockTime}';
}

function gameOver() {
    stopClock();
    toggleModal();
}

function resetGame() {
  resetClockAndTime();
  resetMoves();
  resetStars();
  shuffleDeck();
  startClock();
}

document.querySelector(".modal__cancel").addEventListener("click", () => {
  toggleModal("hide");
});

document.querySelector(".modal__replay").addEventListener("click", () => {
  toggleModal("hide");
  shuffleDeck();
});
document.querySelector(".restart").addEventListener("click", () => {
  resetGame();
});

function resetClockAndTime() {
  clockOff = true;
  time = 0;
  displayTime('Time');
}

function resetMoves() {
  moves = 0;
  document.querySelector('.moves').innerHTML = moves;
}

function resetStars() {
  stars = 0;
  const startList = document.querySelectorAll('.stars li');
  for (star of starList) {
    star.style.display = 'inline';
  }
}

function resetCards() {
  const cards = document.querySelectorAll(".deck li");
  for (let card of cards) {
    card.className = "card";
  }
}
