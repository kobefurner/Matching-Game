"use strict";

/**
 * Author: Kobe Furner
 * Date: 7/31/23
 */

//Load style when browser opens
window.addEventListener("load", makeStyles);

//Creating style
function makeStyles() {
    var Style = document.createElement("style");
    document.head.appendChild(Style);

    document.styleSheets[document.styleSheets.length - 1].insertRule(
        "body { \
            font-family: Arial, sans-serif; \
        }", 0);

    document.styleSheets[document.styleSheets.length - 1].insertRule(
        "html { \
            background-color: pink; \
            height: 100%; \
        }", 1);

    document.styleSheets[document.styleSheets.length - 1].insertRule(
        "h1 { \
            margin: auto; \
            text-align: center; \
            padding-top: 25px; \
            padding-bottom: 20px; \
        }", 2);

    document.styleSheets[document.styleSheets.length - 1].insertRule(
        "div#guesses { \
            text-align: center; \
            margin: auto; \
            font-size: 20px; \
        }", 3);

    const numSymbols = parseInt(document.getElementById('numSymbols').value);
    const cardWidth = 100 / numSymbols;
    const cardStyle = "div.card { \
        width: " + cardWidth + "%; \
        float: left; \
        box-sizing: border-box; \
        padding: 5px; \
        margin: auto; \
    }";

    document.styleSheets[document.styleSheets.length - 1].insertRule(cardStyle, 4);

    document.styleSheets[document.styleSheets.length - 1].insertRule(
        "#board { \
            display: flex; \
            flex-wrap: wrap; \
            justify-content: center; \
        }", 5);

    document.styleSheets[document.styleSheets.length - 1].insertRule(
        "div#startForm { \
            text-align: center; \
            margin: auto; \
        }", 6);
}


//Global variables
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let numMatches = 0;
let guesses = 0;
let doubledSymbols = [];

//Game gets triggered when the user presses the play now button
document.getElementById("startButton").addEventListener('click', function(){
    const numSymbols = parseInt(document.getElementById('numSymbols').value);

    //symbols for the game
    const symbols = ['!', '@', '#', '$', '%', '?', '&', '*'];

    //Adds two of each symbol to the doubleSymbols array
    for (var i = 0; i < numSymbols; i++){
        const symbol = symbols[i];
        doubledSymbols.push(symbol, symbol);
    }

    shuffle(doubledSymbols);
    createBoard(doubledSymbols);

    //Hids the startForm when the user presses the play now button
    const startForm = document.getElementById('startForm');
    startForm.style.display = 'none';
});

//Shuffles the doubleSymbols array
function shuffle(array){
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

//Creates the board of cards
function createBoard(doubledSymbols) {
    const board = document.createElement('div');
    board.id = 'board';

    /** Iterates through each card and adds style to them
     *  Cards are displayed as black and the text is transparent
     *  When the card gets clicked, the card is displayed with and the text is revealed
    **/
    for (const i of doubledSymbols){
        const card = document.createElement('div');
        card.textContent = i;
        card.addEventListener('click', onCardClick);
        card.classList.add('card');
        card.style.width = '80px';
        card.style.height = '80px';
        card.style.border = '2px solid black';
        card.style.textAlign = 'center';
        card.style.lineHeight = '80px';
        card.style.fontSize = '25px';
        card.style.margin = '5px';
        card.style.cursor = 'pointer'
        card.style.backgroundColor = 'black';
        card.style.color = 'transparent';
        card.style.transition = 'background-color 0.5s, color 0.5s';

        card.dataset.matched = 'false';

        board.appendChild(card);
    }

    document.body.appendChild(board)
}

//Once card is clicked, it turns to white and the symbol is revealed
//The cards are then sent to the checkForMatch function to see if they match
function onCardClick(event) {
    const card = event.target;
    if (lockBoard || card === firstCard || card.dataset.matched === 'true') return;
  
    card.style.backgroundColor = 'white';
    card.style.color = 'black';
  
    if (!firstCard) {
      firstCard = card;
    } else {
      secondCard = card;
      guesses++;
      updateGuesses();
      checkForMatch();
    }
  }

//Checks to see if two cards match
function checkForMatch() {
    const matched = firstCard.textContent === secondCard.textContent;
  
    if (matched) {
      numMatches++;
      firstCard.dataset.matched = 'true'; 
      secondCard.dataset.matched = 'true'; 
  
      if (numMatches === doubledSymbols.length / 2) {
        // All cards matched, game over!
        setTimeout(() => {
          alert("Congratulations! You've matched all the cards.");
          resetGame();
        }, 500);
      } else {
        // Cards matched, keep them face-up
        firstCard.removeEventListener('click', onCardClick);
        secondCard.removeEventListener('click', onCardClick);
        resetCards();
      }
    } else {
      // Cards didn't match, flip them back after a short delay
      lockBoard = true;
      setTimeout(() => {
        firstCard.style.backgroundColor = 'black';
        secondCard.style.backgroundColor = 'black';
        firstCard.style.color = 'transparent';
        secondCard.style.color = 'transparent';
        lockBoard = false;
        resetCards();
      }, 1000);
    }
  }

//Resets the cards back to null
function resetCards() {
    firstCard = null;
    secondCard = null;
}

//Resets the game after the user has won
function resetGame() {
    numMatches = 0;
    guesses = 0;
    updateGuesses();
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
      card.style.backgroundColor = 'black';
      card.style.color = 'transparent';
      card.dataset.matched = 'false';
      card.addEventListener('click', onCardClick);
    });
    resetCards();
  }

//Updates the guess count each time the user check two cards
function updateGuesses() {
    const guessesDIV = document.getElementById('guesses');
    if (guessesDIV) {
        guessesDIV.textContent = 'Guesses: ' + guesses;
    }
    else {
        const guessesDIV = document.createElement('div');
        guessesDIV.id = 'guesses';
        guessesDIV.textContent = 'Guesses: ' + guesses;
        document.body.appendChild(guessesDIV);
    }
}