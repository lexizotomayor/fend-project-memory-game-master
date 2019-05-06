// The number seconds to wait before hiding 2 cards that do not match
const BAD_MATCH_DELAY_MILLISECONDS = 750;

/*
 * Create a list that holds all of your cards
 */
let deck = document.getElementById("deck");
let cards = [];
let moveCounter = document.getElementById("moves");
let numMoves;
let numMatches;
let openCards;
let stars = document.getElementsByClassName('star');
let time = document.getElementById('time');
let minutes;
let seconds;
var clock;

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

 deck.addEventListener("click", onDeckOrChildClicked);
 document.getElementById("restart").addEventListener("click", startGame);

 // THIS IS THE FUNCTION that GETS CALLED WHEN A CARD IS CLICKED ON
 function onDeckOrChildClicked(event) {
     // Abort if just the deck was clicked
     if (event.target.id === "deck") return;

    if (!clock) {
        clock = setInterval(setTime, 1000);
    }

     if (openCards.length < 2) {

        // event.target is the card that was clicked
        const card = event.target;
        card.classList.add("open");
        openCards.push(card);
        checkForMatch();
     }
 }

/**
 * Checks for a match between the first two cards in openCards.
 */
function checkForMatch() {
    if (openCards.length > 1) {
        /**
         * At this point, we have two opened cards
         * and we need to check for a match.
         */
        numMoves++;
        moveCounter.innerText = numMoves; // Moves counter
        setStarRating();

        const cardA = openCards.pop();
        const cardB = openCards.pop();
        const frontA = cardA.children[0].children[0];
        const frontB = cardB.children[0].children[0];
        // True if the cards match.
        if (frontA.src === frontB.src) {
            cardA.className = "card match";
            cardB.className = "card match";
            numMatches++;
            if (numMatches == 8) {
                endGame();
            }
        // Cards do not match.
        } else {
            openCards.push(cardA);
            openCards.push(cardB);
            window.setTimeout(hideAllOpenCards, BAD_MATCH_DELAY_MILLISECONDS);
        }
    }
 }

/**
 * Hide all cards in openCards and empties the array.
 */
function hideAllOpenCards() {
    while (openCards.length > 0) {
        let card = openCards.pop();
        card.classList.remove("open");
    }
}

function endGame() {
    let modalTime = document.getElementById('modal-time');
    modalTime.innerText = `${addLeadingZeroes(minutes)}:${addLeadingZeroes(seconds)}`;

    let modalMoves = document.getElementById('modal-moves');
    modalMoves.innerText = numMoves + " moves";

    let modalStars = document.getElementById('modal-stars');
    modalStars.innerHTML = document.querySelector('.stars').innerHTML;

    let modal = document.getElementById('modal-box');
    modal.style.display = "flex";
}


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function startGame() {
    // Initialize values
    openCards = [];
    numMoves = 0;
    numMatches = 0;
    moveCounter.innerText = numMoves;
    minutes = 0;
    seconds = 0;
    time.innerText = "00:00";
    if (clock) {
        clearInterval(clock);
        clock = null;
    }
    setStarRating();

    // CREATE THE CARDS
    for (let i = 0; i < 16; i++) {
        const card = document.createElement("li");
        card.className = "card";
        card.innerHTML = `<div class="card-animator">
            <img class="front" src="${getPngPath(i)}">
            <div class="back c-${i}"></div>
        </div>`;
        cards[i] = card;
    }

    // Shuffle cards
    cards = shuffle(cards);
    deck.innerHTML = "";
    for (const card of cards) {
        deck.appendChild(card);
    }
}

/**
 * Takes a card index and returns an appropriate class for its front.
 * @param {*} index Index of a card.
 */
function getPngPath(index) {
    let matchNumber = index % 8;
    switch (matchNumber) {
        case 0:
        return 'LOGOS/1.png';
        case 1:
        return 'LOGOS/2.png';
        case 2:
        return 'LOGOS/3.png';
        case 3:
        return 'LOGOS/4.png';
        case 4:
        return 'LOGOS/5.png';
        case 5:
        return 'LOGOS/6.png';
        case 6:
        return 'LOGOS/7.png';
        case 7:
        return 'LOGOS/8.png';
        default:
        return 'LOGOS/9.png';
    }
}

function setStarRating() {
    if (numMoves == 0) {
        stars[2].className = "star fa fa-star";
        stars[1].className = "star fa fa-star";
        stars[0].className = "star fa fa-star";
    } else if (numMoves == 20) {
        //show two stars
        stars[2].className = "star far fa-star";
    } else if (numMoves == 30 ) {
        //show 1 star
        stars[1].className = "star far fa-star";
    }
}

function setTime() {
    seconds++;
    if (seconds == 60) {
        minutes++;
        seconds = 0;
    }
    time.innerText = `${addLeadingZeroes(minutes)}:${addLeadingZeroes(seconds)}`;
}

function addLeadingZeroes(num) {
    var numString = num.toString();
    while (numString.length < 2) {
        numString = "0" + numString;
    }
    return numString;
}

function onModalCloseClicked() {
    let modal = document.getElementById('modal-box');
    modal.style.display = "none";
}

function onModalRestartClicked() {
    let modal = document.getElementById('modal-box');
    modal.style.display = "none";
    startGame();
}

startGame();