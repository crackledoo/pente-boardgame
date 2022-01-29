//This script plays a game of Pente between two human players
//
//The main goal of the scripting exercise is to use as little global
//code as possible by utilizing modules/factories.
//
//These are the script's global variables:
  //GameBoard module
  //GameFlow module
  //playerOne Object
  //playerTwo Object


//Create a GameBoard module
//This:
//hears from GameFlow module and Player units
//speaks to the GameFlow module and Player units
//acts as main UI
const GameBoard = ( () => {
  const GRID_SIZE = 17;
  const WINNING_LENGTH = 5;

  let spacesFilled = 0;
  //displayBoard: displays the play area grid and game info
  const displayBoard = function() {
    //first, the play area grid
    let board = document.getElementById('gameBoard');
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        let div = document.createElement('div');
        div.classList.add('grid-square');
        div.setAttribute('id', `${x} ${y}`);
        board.appendChild(div);
      }
    }
    //then game info for each player: captures and scores.
    //captures:
    const captureDivList = document.querySelectorAll('.captures');
    const pOneCaptureDiv = captureDivList[0];
    const pTwoCaptureDiv = captureDivList[1];
    pOneCaptureDiv.setAttribute('id', playerOne.name);
    pTwoCaptureDiv.setAttribute('id', playerTwo.name);

    //scores:
    playerOne.scoreboard.textContent = `${playerOne.name}: ${playerOne.gameScore}`;
    playerTwo.scoreboard.textContent = `${playerTwo.name}: ${playerTwo.gameScore}`;
  }

  //resetGame: resets the page for a new game
  const resetGame = function() {
    location.reload();
  }

  //makeMove: place piece onto  array, update HTML, end turn
  //the function's -this- is bound through a PlayerFactory function
  const makeMove = function(square) {
    let div = document.createElement('div');
    div.classList.toggle('occupied');
    div.setAttribute('id', GameFlow.activePlayer.color)
    square.appendChild(div);
    //square.textContent = this;
    let id = square.getAttribute('id');
    let idArray = id.split(" ");
    let x = Number(idArray[0]);
    let y = Number(idArray[1]);
    if (isWon(x, y)) {
      spacesFilled = 0;
      GameFlow.activePlayer.gameScore++;
      sayVictory(GameFlow.activePlayer);
    } else {
      spacesFilled++;
      if (spacesFilled >= GRID_SIZE * GRID_SIZE) {
        console.log(spacesFilled);
        spacesFilled = 0;
        sayVictory(null);
      }
      GameFlow.changeTurn();
    }
  }
  const failMove = function(square) {
    console.log(`Unable to place ${square} there!`);
  }

  const isOccupied = function(x, y) {
    let gridSquare = document.getElementById(`${x} ${y}`);
    if (gridSquare.firstChild) return true;
    return false;
  }

  //ownsOccupant: return true if player occupies square
  const ownsOccupant = function(x, y) {
    let gridSquare = document.getElementById(`${x} ${y}`);
    try {
      if (!gridSquare.firstChild) {
        return false;
      }
    } catch {
      return false;
    }
    let squareId = gridSquare.firstChild.getAttribute('id');
    if (squareId != GameFlow.activePlayer.color) {
      return false;
    }
    return true;
  }
  
  //isWon: checks to see if a winning score has been found
  const isWon = function(x, y) {
    //counts the longest length of three directions
    let points = 0;
    let tempPoints = 0;
    const findHighest = function() {
      if (tempPoints > points) {
        points = tempPoints;
      }
    }
    //horizontal check
    tempPoints = rowScoreCheck(x, y, 1, 0);
    let coordArray = rowCaptureCheck(x, y, 1, 0);
    if (coordArray) capture(x, y, coordArray[0], coordArray[1]);
    findHighest();
    //verical check
    tempPoints = rowScoreCheck(x, y, 0, 1);
    coordArray = rowCaptureCheck(x, y, 0, 1);
    if (coordArray) capture(x, y, coordArray[0], coordArray[1]);
    findHighest();
    //slope +1 diagonal check
    tempPoints = rowScoreCheck(x, y, 1, 1);
    coordArray = rowCaptureCheck(x, y, 1, 1);
    if (coordArray) capture(x, y, coordArray[0], coordArray[1]);
    findHighest();
    //slope -1 diagonal check
    tempPoints = rowScoreCheck(x, y, -1, 1);
    coordArray = rowCaptureCheck(x, y, -1, 1);
    if (coordArray) capture(x, y, coordArray[0], coordArray[1]);
    findHighest();
    if (points >= WINNING_LENGTH) return true;
    if (GameFlow.activePlayer.captureScore >= WINNING_LENGTH) return true;
  }

  //rowScoreCheck
  //it returns the longest possible length,
  //measured from the last-placed piece,
  //where directions are measured by diffX / diffY
  const rowScoreCheck = function(x, y, diffX, diffY) {
    let points = 0;
    let tempX = x;
    let tempY = y;
    for (let d = 0; d < WINNING_LENGTH; d++) {
      if (!ownsOccupant(tempX, tempY)) {
        break;
      }
      tempX = tempX + diffX;
      tempY = tempY + diffY;
      points++;
    }
    tempX = x;
    tempY = y;
    diffX = diffX * -1;
    diffY = diffY * -1;
    points--;
    for (let d = 0; d < WINNING_LENGTH; d++) {
      if (!ownsOccupant(tempX, tempY)) {
        break;
      }
      tempX = tempX + diffX;
      tempY = tempY + diffY;
      points++;
    }
    return points;
  }

  //rowCaptureCheck
  //returns an array of [diffX, diffY] 
  //if a capture can be made
  const rowCaptureCheck = function (x, y, diffX, diffY) {
    let opponentPieces = 0;
    let tempX = x + diffX;
    let tempY = y + diffY;
    while(true) {
      if (!isOccupied(tempX, tempY) || ownsOccupant(tempX, tempY)) break;
      tempX = tempX + diffX;
      tempY = tempY + diffY;
      opponentPieces++;
      if (opponentPieces == 2) {
        if (ownsOccupant(tempX, tempY)) return [diffX, diffY];
      }
    }
    diffX = diffX * -1;
    diffY = diffY * -1;
    tempX = x + diffX;
    tempY = y + diffY;
    opponentPieces = 0;
    while(true) {
      if (!isOccupied(tempX, tempY) || ownsOccupant(tempX, tempY)) break;
      tempX = tempX + diffX;
      tempY = tempY + diffY;
      opponentPieces++;
      if (opponentPieces == 2) {
        if (ownsOccupant(tempX, tempY)) return [diffX, diffY];
      }
    }
    return false;
  }
  //capture: removes the pieces from the board
  //prompts countCapture for scoring & UI
  const capture = function(x, y, diffX, diffY) {
    let tempX = x + diffX;
    let tempY = y + diffY;
    let gridSquare = document.getElementById(`${tempX} ${tempY}`);
    gridSquare.removeChild(gridSquare.firstChild);
    tempX = tempX + diffX;
    tempY = tempY + diffY;
    gridSquare = document.getElementById(`${tempX} ${tempY}`);
    gridSquare.removeChild(gridSquare.firstChild);
    countCapture();
  }

  //adds to the player's captureScore, and adds captured pieces to UI
  const countCapture = function() {
    GameFlow.activePlayer.captureScore++;
    let captureDiv = document.getElementById(GameFlow.activePlayer.name);
    for (let i = 0; i < 2; i++) {
      let newPiece = document.createElement('div');
      if (GameFlow.activePlayer.name == playerOne.name) {
        newPiece.setAttribute('id', playerTwo.color);
        newPiece.setAttribute('class', 'occupied');
      } else {
        newPiece.setAttribute('id', playerOne.color);
        newPiece.setAttribute('class', 'occupied');
      }
      captureDiv.appendChild(newPiece);
    }
  }

  
  //sayVictory: displays victory screen, asks GameFlow to end
  const sayVictory = function(winner) {
    let winningText = `${GameFlow.activePlayer.name} has won!`;
    if (!winner) {
      winningText = "Tie!";
    }
    let textField = document.getElementById('victoryh1');
    textField.textContent = winningText;
    let modal = document.querySelector('.victory-screen');
    modal.style.display='block';
    let closeButton = document.querySelector('.close');
    closeButton.onclick = function() {
      modal.style.display = 'none';
      GameFlow.endGame();
    }
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = 'none';
        GameFlow.endGame();
      }
    }
  }

  const clearBoard = function() {
    let board = document.getElementById('gameBoard');
    while (board.firstChild) {
      board.removeChild(board.firstChild)
    }
    let captureDivs = document.querySelectorAll('.captures');
    captureDivs.forEach(function(div) {
      while(div.firstChild) {
        div.removeChild(div.firstChild);
      }
    });
  }
  //user interaction listener!:
    //click will change css to either:
      //makeMove if legal
      //failMove if illegal
  const addListeners = function() {
    let squares = [...document.querySelectorAll('div#gameBoard > div')];
    squares.forEach((square) => {
      square.addEventListener('click', function() {
        if (square.firstChild) {
          failMove(square);
        } else {
          GameFlow.activePlayer.makeMove(square);
        }
      });
    });
  }

  return {displayBoard,
          resetGame,
          makeMove, 
          ownsOccupant,
          addListeners,
          clearBoard
          };
}) ();

  


//Create a GameFlow module
//This:
  //speaks to the Player units and the GameBoard module
  //hears from the GameBoard module
const GameFlow = ( () => {
  let activePlayer = 0;
  const changeTurn = function() {
    playerOne
    if (GameFlow.activePlayer == playerOne) {
      GameFlow.activePlayer = playerTwo;
    } else {
      GameFlow.activePlayer = playerOne;
    }
    playerOne.scoreboard.classList.toggle('is-turn');
    playerTwo.scoreboard.classList.toggle('is-turn');
  }
  //startGame: loads gameboard and assigns first turn
  const startGame = function() {
    GameBoard.displayBoard();
    GameBoard.addListeners();
    playerOne.captureScore = 0;
    playerTwo.captureScore = 0;
    GameFlow.changeTurn();
  }
  //endGame: asks GameBoard to clear the board,
  //checks if roundCount has hit its limit
  const endGame = function() {
    GameBoard.clearBoard();
    startGame();
  }
  return {changeTurn,
          startGame,
          endGame,
          activePlayer}
})();


//Create a Player factory
//These:
//speak to the GameBoard module
//hear from the GameFlow module
const PlayerFactory = (name, color, idString) => {
  let gameScore = 0;
  let captureScore = 0;
  const scoreboard = document.getElementById(idString);
  const makeMove = GameBoard.makeMove.bind(color);
  return {name, color, gameScore, captureScore, scoreboard, makeMove};
}




//submitting the form begins the game by creating persons, 
//loading GameBoard, and starting GameFlow
document.addEventListener("DOMContentLoaded", function() {
  let modal = document.getElementById('createModal');
  modal.style.display='block';
  let submitButton = document.getElementById('submit');
  submitButton.onclick = function() {
    let pOneName = document.getElementById('pOneName').value;
    let pTwoName = document.getElementById('pTwoName').value;
    pOneName = !pOneName ? 'Player One' : pOneName;
    pTwoName = !pTwoName ? 'Player Two' : pTwoName;
    let pOneColor = document.getElementById('pOneColor').value;
    let pTwoColor = document.getElementById('pTwoColor').value;
    modal.style.display = 'none';
    console.log(pOneColor);
    console.log(pTwoColor);
    //cast these as global variables to use in modules
    playerOne = PlayerFactory(pOneName, pOneColor, 'pOneScore')
    playerTwo = PlayerFactory(pTwoName, pTwoColor, 'pTwoScore');
    GameFlow.startGame();
  }
});

