const Gameboard = (function () {
  let board = [];

  for (let i = 0; i < 3; i++) {
    board[i] = [];
    for (let j = 0; j < 3; j++) {
      board[i].push("");
    }
  }

  const getBoard = () => board;

  const placeMarker = (row, column, marker) => {
    if (board[row][column] !== "") {
      return false;
    } else {
      board[row][column] = marker;
      return true;
    }
  };

  const getCellValue = (row, column) => board[row][column];

  const resetTheBoard = () => {
    board = board.map((row) => row.map(() => ""));
  };

  return { getBoard, placeMarker, getCellValue, resetTheBoard };
})();

function Player(name, marker) {
  return {
    name,
    marker,
  };
}

const GameController = (function () {
  const player1 = Player("Player-1", "O");
  const player2 = Player("Player-2", "X");
  let currentPlayer = player1;
  let isGameOver = false;

  const setPlayersNames = (name1, name2) => {
    player1.name = name1 === "" ? "Player-1" : name1;
    player2.name = name2 === "" ? "Player-2" : name2;
  };

  const startGame = () => {
    Gameboard.resetTheBoard();
    currentPlayer = player1;
    isGameOver = false;
    DisplayController.displayMessage("turn", currentPlayer);
    DisplayController.enableBoard();
  };

  const getCurrentPlayer = () => currentPlayer;

  const switchTurn = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const playRound = (row, column) => {
    const outcome = {
      success: false,
      isGameOver: false,
      message: "",
      currentPlayer: currentPlayer,
    };

    if (isGameOver) {
      outcome.message =
        "Game is already over! Click 'Start New Game' to play again.";
      outcome.isGameOver = true;
      return outcome;
    }

    const marked = Gameboard.placeMarker(row, column, currentPlayer.marker);
    DisplayController.renderBoard();

    if (marked) {
      outcome.success = true;
      const winMessage = checkForWin();
      const tieMessage = checkForTie();

      if (winMessage) {
        isGameOver = true;
        outcome.isGameOver = true;
        outcome.message = winMessage;
        console.log(winMessage);
      } else if (tieMessage) {
        isGameOver = true;
        outcome.isGameOver = true;
        outcome.message = tieMessage;
        console.log(tieMessage);
      } else {
        switchTurn();
        outcome.message = "turn";
        outcome.currentPlayer = currentPlayer;
      }
    } else {
      outcome.success = false; // Marker not placed
      outcome.message = "Cell already occupied!";
      console.log(`${row}X${column} cell already occupied.`);
    }

    if (outcome.isGameOver) {
      DisplayController.disableBoard();
    }

    return outcome;
  };

  const checkForWin = () => {
    const board = Gameboard.getBoard();
    const marker = currentPlayer.marker;

    if (
      (board[0][0] === marker &&
        board[0][1] === marker &&
        board[0][2] === marker) ||
      (board[1][0] === marker &&
        board[1][1] === marker &&
        board[1][2] === marker) ||
      (board[2][0] === marker &&
        board[2][1] === marker &&
        board[2][2] === marker)
    ) {
      return `${currentPlayer.name} Won! (row)`;
    } else if (
      (board[0][0] === marker &&
        board[1][0] === marker &&
        board[2][0] === marker) ||
      (board[0][1] === marker &&
        board[1][1] === marker &&
        board[2][1] === marker) ||
      (board[0][2] === marker &&
        board[1][2] === marker &&
        board[2][2] === marker)
    ) {
      return `${currentPlayer.name} Won! (column)`;
    } else if (
      (board[0][0] === marker &&
        board[1][1] === marker &&
        board[2][2] === marker) ||
      (board[2][0] === marker &&
        board[1][1] === marker &&
        board[0][2] === marker)
    ) {
      return `${currentPlayer.name} Won! (diagonal)`;
    } else {
      return false;
    }
  };

  const checkForTie = () => {
    const board = Gameboard.getBoard();
    let allCellsFilled = true;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === "") {
          allCellsFilled = false;
          break;
        }
      }
      if (!allCellsFilled) {
        break;
      }
    }

    if (allCellsFilled && !checkForWin()) {
      return "TIE! All cells are filled.";
    }

    return false;
  };

  return { startGame, playRound, setPlayersNames, getCurrentPlayer };
})();

const DisplayController = (function () {
  const boardContainer = document.querySelector("#gameBoard");
  const messageDiv = document.querySelector("#displayMessage");

  const renderBoard = () => {
    const board = Gameboard.getBoard();
    boardContainer.innerHTML = "";
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        const div = document.createElement("div");
        div.textContent = board[i][j];
        div.dataset.row = i;
        div.dataset.column = j;
        boardContainer.appendChild(div);
      }
    }
  };

  const handleBoardClick = (evt) => {
    const clickedCell = evt.target;
    if (
      clickedCell.dataset.row !== undefined &&
      clickedCell.dataset.column !== undefined
    ) {
      const row = parseInt(clickedCell.dataset.row);
      const column = parseInt(clickedCell.dataset.column);

      const outcome = GameController.playRound(row, column);
      renderBoard();

      if (outcome.isGameOver) {
        displayMessage(outcome.message);
      } else if (!outcome.success) {
        displayMessage("invalid-move");
      } else {
        displayMessage("turn", outcome.currentPlayer);
      }

      console.log(`${row}X${column} clicked.`);
    }
  };

  boardContainer.addEventListener("click", handleBoardClick);

  const disableBoard = () => {
    boardContainer.classList.add("game-over");
  };

  const enableBoard = () => {
    boardContainer.classList.remove("game-over");
  };

  const displayMessage = (messageType, currentPlayer = null) => {
    if (messageDiv) {
      if (messageType === "turn" && currentPlayer) {
        messageDiv.textContent = `${currentPlayer.name}'s turn.`;
      } else if (messageType === "invalid-move") {
        messageDiv.textContent = `That spot is taken!`;
      } else {
        messageDiv.textContent = messageType;
      }
    }
  };

  return { renderBoard, displayMessage, disableBoard, enableBoard };
})();

const startBtn = document.querySelector("#startGame");
startBtn.addEventListener("click", () => {
  let player1InputName = document.querySelector("#player1");
  let player2InputName = document.querySelector("#player2");
  player1InputName = player1InputName.value.trim().toUpperCase();
  player2InputName = player2InputName.value.trim().toUpperCase();

  GameController.setPlayersNames(player1InputName, player2InputName);
  GameController.startGame();
  DisplayController.renderBoard();
});
// DisplayController.renderBoard(); // hides board. so the board only shown after 'start game' button clicked.
