const Gameboard = (function () {
  let board = [];
  const row = 3;
  const column = 3;

  for (let i = 0; i < row; i++) {
    board[i] = [];
    for (let j = 0; j < column; j++) {
      board[i].push("");
    }
  }

  const getBoard = () => board;
  return { getBoard };
})();

function Player(name, symbol) {
  return {
    name,
    symbol,
  };
}

const GameController = (function () {
  /*
    TO DO:
    -switchPlayerTurn
    -check who won etc
   */
})();

console.log(Gameboard.getBoard());
