// GameBoard Module
const gameBoard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""]; // Represents the 3x3 board

    const getBoard = () => board;

    const updateBoard = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
            return true; // Move was successful
        }
        return false; // Cell already occupied
    };

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    return { getBoard, updateBoard, resetBoard };
})();

// GameController Module
const gameController = (() => {
    const player = (name, marker) => {
        return ({name, marker});
    };
    const player1 = player("Player 1", "X");
    const player2 = player("Player 2", "O");
    let currentPlayer = player1;

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

    const handlePlayerMove = (index) => {
        if (gameBoard.updateBoard(index, currentPlayer.marker)) {
            displayController.render();
            if (checkWin(gameBoard.getBoard())) {
                displayController.setMessageHandler(`${currentPlayer.name} wins!`);
                displayController.addSquareClickHandler(() => {}); // Disable clicks
            } else if (checkDraw(gameBoard.getBoard())) {
                displayController.setMessageHandler("It's a tie!");
                displayController.addSquareClickHandler(() => {}); // Disable clicks
            } else {
                switchPlayer();
                displayController.setMessageHandler(`${currentPlayer.name}'s turn`);
            }
        }
    };

    const restartGame = () => {
        gameBoard.resetBoard();
        displayController.render();
        currentPlayer = player1;
        displayController.setMessageHandler(`${currentPlayer.name}'s turn`);
        // Re-add the click handler to the board
        displayController.addSquareClickHandler(handlePlayerMove);
    };

    const init = () => {
        displayController.render();
        displayController.setMessageHandler(`${currentPlayer.name}'s turn`);
        displayController.addSquareClickHandler(handlePlayerMove);
        displayController.addRestartHandler(restartGame);
    };

    return { init };


  
})();

const displayController = (() => {
    const boardElement = document.getElementById("game-board");
    const messageElement = document.getElementById("message");
    const restartButton = document.getElementById("restart-button");

    const render = () => {
        boardElement.innerHTML = "";
        const board = gameBoard.getBoard();
        board.forEach((marker, index) => {
            const square = document.createElement("div");
            square.classList.add("square");
            square.textContent = marker;
            square.dataset.index = index; // Store the index in a data attribute
            boardElement.appendChild(square);
        });
    };

    const setMessageHandler = (message) => {
        messageElement.textContent = message;
    };

    const addSquareClickHandler = (handler) => {
        boardElement.addEventListener("click", (event) => {
            if (event.target.classList.contains("square")) {
                const index = event.target.dataset.index;
                handler(index);
            }
        });
    };

    const addRestartHandler = (handler) => {
        restartButton.addEventListener("click", handler);
    };

    return { render, setMessageHandler, addSquareClickHandler, addRestartHandler };
})();

gameController.init();