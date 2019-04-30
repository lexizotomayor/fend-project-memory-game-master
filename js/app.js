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
let openCards = [];

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

 deck.addEventListener("click", show);
 document.getElementById("restart").addEventListener("click", startGame);

 // THIS IS THE FUNCTION that GETS CALLED WHEN A CARD IS CLICKED ON
 function show(event) {
     // Abort if just the deck was clicked
     if (event.target.id === "deck") return;

     if (openCards.length < 2) {

        // event.target is the card that was clicked
        const card = event.target;
        card.classList.add("show");
        card.classList.add("open");
   
        openCards.push(card);
   
       /**
        * At this point, we have two opened cards
        * and we need to check for a match.
        */
        if (openCards.length > 1) {
           checkForMatch(card, window.openCard);
           delete window.openCard;
        }
   
       numMoves++;
       moveCounter.innerText = numMoves;
     }
 }

/**
 * Checks for a match between the first two cards in openCards.
 */
function checkForMatch() {
    if (openCards.length > 1) {
        const cardA = openCards.pop();
        const cardB = openCards.pop();
        const frontA = cardA.children[0].children[0];
        const frontB = cardB.children[0].children[0];
        // True if the cards match.
        if (frontA.className === frontB.className) {
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
            window.setTimeout(hideAllOpenCards, BAD_MATCH_DELAY_MILLISECONDS)
        }
    }
 }

function hideAllOpenCards() {
    while (openCards.length > 0) {
        let card = openCards.pop();
        card.classList.remove("show");
        card.classList.remove("open");
    }
}

function endGame() {
    // TODO show the final score 
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function startGame() {
    // Initialize values
    numMoves = 0;
    numMatches = 0;
    moveCounter.innerText = numMoves;

    // CREATE THE CARDS
    for (let i = 0; i < 16; i++) {
        const card = document.createElement("li");
        card.className = "card";
        card.innerHTML = `<div class="card-animator">
            <div class="${getCardFront(i)}"></div>
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
function getCardFront(index) {
    let matchNumber = index % 8;
    switch (matchNumber) {
        case 0:
        return 'front fa fa-diamond';
        case 1:
        return 'front fa fa-paper-plane-o';
        case 2:
        return 'front fa fa-anchor';
        case 3: 
        return 'front fa fa-bolt';
        case 4:
        return 'front fa fa-cube';
        case 5:
        return 'front fa fa-leaf';
        case 6:
        return 'front fa fa-bicycle';
        case 7:
        return 'front fa fa-bomb';
        default:
        return 'front fa fa-question-circle-o';
    }
}

startGame();