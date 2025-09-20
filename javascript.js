// GameBoard Module
const gameBoard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""]; // Represents the 3x3 board

    const getBoard = () => board;

    const placeMarker = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
            return true; // Move was successful
        }
        return false; // Cell already occupied
    };

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    return { getBoard, placeMarker, resetBoard };
})();

// GameController Module
const gameController = (() => {
    const player = (name, marker) => {
        return ({name, marker});
    };
    const player1 = player("Player 1", "X");
    const player2 = player("Player 2", "O");
    let currentPlayer = player1;
    let gameOver = false;

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };
    
    const checkWin = () => {
        const board = gameBoard.getBoard();
        const winPatterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8], // Rows
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8], // Columns
            [0, 4, 8],
            [2, 4, 6], // Diagonals
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
  };

  const checkDraw = () => {
    return gameBoard.getBoard().every((cell) => cell !== "");
  };

  const printBoard = () => {
    const board = gameBoard.getBoard();
    console.log(`
      ${board[0] || "1"} | ${board[1] || "2"} | ${board[2] || "3"}
      ---------
      ${board[3] || "4"} | ${board[4] || "5"} | ${board[5] || "6"}
      ---------
      ${board[6] || "7"} | ${board[7] || "8"} | ${board[8] || "9"}
    `);
  };

  const playTurn = (index) => {
    if (gameOver) {
      console.log("Game is over. Start a new game to play again.");
      return;
    }

    if (gameBoard.placeMarker(index, currentPlayer.marker)) {
      printBoard();
      if (checkWin()) {
        console.log(`${currentPlayer.name} wins!`);
        gameOver = true;
      } else if (checkDraw()) {
        console.log("It's a draw!");
        gameOver = true;
      } else {
        switchPlayer();
        console.log(`${currentPlayer.name}'s turn (${currentPlayer.marker})`);
      }
    } else {
      console.log("Invalid move. That spot is already taken or out of bounds.");
    }
  };

  const startGame = () => {
    gameBoard.resetBoard();
    currentPlayer = player1;
    gameOver = false;
    printBoard();
    console.log(`${currentPlayer.name}'s turn (${currentPlayer.marker})`);
  };

  return { startGame, playTurn };
})();
