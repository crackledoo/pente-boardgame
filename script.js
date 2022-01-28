//This script plays a game of tic-tac-toe between two human players
//
//The main goal of the scripting exercise is to use as little global
//code as possible by utilizing modules/factories.
//
//These are the script's global variables:
  //GameBoard module
  //GameFlow module
  //playerOne Object
  //playerTwo Object
//
//
//The code is also designed with expandability in mind.
//It will later become the foundation for a game-project called 'Pente'.


//Create a GameBoard module
//This:
//hears from GameFlow module, and Player units
//speaks to the GameFlow module
//acts as main UI
const GameBoard = ( () => {
  const GRID_SIZE = 17;
  const WINNING_LENGTH = 5;
  let spacesFilled = 0;

  //displayBoard: displays the play area grid to a specified length
  const displayBoard = function() {
    let board = document.getElementById('gameBoard');
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let y = 0; y < GRID_SIZE; y++) {
        let div = document.createElement('div');
        div.classList.add('grid-square');
        div.setAttribute('id', `${x} ${y}`);
        board.appendChild(div);
      }
    }
    playerOne.scoreboard.textContent = `${playerOne.name}: ${playerOne.score}`;
    playerTwo.scoreboard.textContent = `${playerTwo.name}: ${playerTwo.score}`;
  }

  //resetBoard: resets the page for a new game
  const resetBoard = function() {
    location.reload();
  }

  //makeMove: place symbol onto  array, update HTML, end turn
  //the function's -this- is bound through a PlayerFactory function
  const makeMove = function(square) {
    let div = document.createElement('div');
    div.classList.toggle('occupied');
    square.appendChild(div);
    //square.textContent = this;
    let id = square.getAttribute('id');
    let idArray = id.split(" ");
    let x = Number(idArray[0]);
    let y = Number(idArray[1]);
    if (isWon(x, y)) {
      spacesFilled = 0;
      GameFlow.activePlayer.score++;
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

  //findOccupant: return a space's occupying symbol
  const findOccupant = function(x, y) {
    let gridSquare = document.getElementById(`${x} ${y}`);
    try {
      if (!gridSquare.textContent.length) {
        return false;
      }
    } catch {
      return false;
    }
    let text = gridSquare.textContent;
    if (text != GameFlow.activePlayer.symbol) {
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
    tempPoints = rowCheck(x, y, 1, 0) 
    findHighest();
    //verical check
    tempPoints = rowCheck(x, y, 0, 1) 
    findHighest();
    //slope +1 diagonal check
    tempPoints = rowCheck(x, y, 1, 1) 
    findHighest();
    //slope -1 diagonal check
    tempPoints = rowCheck(x, y, -1, 1) 
    findHighest();
    if (points >= WINNING_LENGTH) {
      return true;
    }
  }

  //rowCheck
  //it returns the longest possible length,
  //measured from the last-placed piece,
  //where directions are measured by diffX / diffY
  const rowCheck = function(x, y, diffX, diffY) {
    let points = 0;
    let tempX = x;
    let tempY = y;
    for (let d = 0; d < WINNING_LENGTH; d++) {
      if (!findOccupant(tempX, tempY)) {
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
      if (!findOccupant(tempX, tempY)) {
        break;
      }
      tempX = tempX + diffX;
      tempY = tempY + diffY;
      points++;
    }
    return points;
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
  }
  //user interaction listener!:
    //click will change css to either:
      //makeMove if legal
      //failMove if illegal
  const addListeners = function() {
    let squares = [...document.querySelectorAll('div#gameBoard > div')];
    squares.forEach((square) => {
      square.addEventListener('click', function() {
        if (square.textContent.length) {
          failMove(square);
        } else {
          GameFlow.activePlayer.makeMove(square);
        }
      });
    });
  }

  return {displayBoard,
          resetBoard,
          makeMove, 
          findOccupant,
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
//speak to the GameBoard units
//hear from the GameFlow module
const PlayerFactory = (name, symbol, idString) => {
  let score = 0;
  const scoreboard = document.getElementById(idString);
  const makeMove = GameBoard.makeMove.bind(symbol);
  return {name, symbol, score, scoreboard, makeMove};
}




//submitting the form begins the game by creating persons, 
//loading GameBoard, and starting GameFlow
document.addEventListener("DOMContentLoaded", function() {
  let modal = document.getElementById('createModal');
  modal.style.display='block';
  let submitButton = document.getElementById('submit');
  submitButton.onclick = function() {
    pOneName = document.getElementById('playerOne').value;
    pTwoName = document.getElementById('playerTwo').value;
    pOneName = !pOneName ? 'Player One' : pOneName;
    pTwoName = !pTwoName ? 'Player Two' : pTwoName;
    modal.style.display = 'none';
    //cast these as global variables to use in modules
    playerOne = PlayerFactory(pOneName, 'X', 'pOneScore')
    playerTwo = PlayerFactory(pTwoName, 'O', 'pTwoScore');
    GameFlow.startGame();
  }
});

