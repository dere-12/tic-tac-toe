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
  const player1 = Player("John", "O");
  const player2 = Player("Doe", "X");
  let currentPlayer = player1;
  let isGameOver = false;

  const startGame = () => {
    Gameboard.resetTheBoard();
    currentPlayer = player1;
    isGameOver = false;
  };

  const switchTurn = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const playRound = (row, column) => {
    if (!isGameOver) {
      console.log(`${currentPlayer.name} has just played. next...`);
      const marked = Gameboard.placeMarker(row, column, currentPlayer.marker);
      if (marked) {
        const win = checkForWin();
        const tie = checkForTie();
        if (win) {
          isGameOver = true;
          console.log(win);
        } else if (tie) {
          isGameOver = true;
          console.log(tie);
        } else {
          switchTurn();
        }
      } else {
        console.log(`${row}X${column} cell already occupied.`);
      }
    }
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

    if (allCellsFilled) {
      return "TIE! All cells are filled.";
    }
  };

  return { startGame, playRound };
})();
