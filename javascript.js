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
    const players = [
        { name: "Player 1", marker: "X"},
        { name: "Player 2", marker: "O"}
    ]
    
    let currentPlayer = players[0];
    let gameIsOver = false;
    let gameIsTied = false;

    const switchPlayer = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
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
        if (gameIsOver) {
            return;
        }
        if (gameBoard.updateBoard(index, currentPlayer.marker)) {
            displayController.render();
            if (checkWin(gameBoard.getBoard())) {
                displayController.setTitleHandler(`${currentPlayer.name} wins!`)
                displayController.setMessageHandler(`Thanks for playing! Click the restart button to play again!`);
                gameIsOver = true; 
            } else if (checkDraw(gameBoard.getBoard())) {
                displayController.setTitleHandler(`It's a tie!`)
                displayController.setMessageHandler(`Thanks for playing! Click the restart button to play again!`);
                gameIsOver = true;
                gameIsTied = true;
            } else {
                switchPlayer();
                displayController.setMessageHandler(`${currentPlayer.name}'s turn`);
            }
        }
    };

    const setNames = (player1name, player2name) => {
        players[0].name = player1name || "Player 1";
        players[1].name = player2name || "Player 2";
        if (gameIsOver && !gameIsTied) {
            displayController.setTitleHandler(`${currentPlayer.name} wins!`);
        } else {displayController.setMessageHandler(`${currentPlayer.name}'s turn`);
        };
    };

    const restartGame = () => {
        gameBoard.resetBoard();
        displayController.render();
        currentPlayer = players[0];
        gameIsOver = false;
        displayController.setMessageHandler(`${currentPlayer.name}'s turn`);
        displayController.setTitleHandler(`Tic-Tac-Toe`);
        // Re-add the click handler to the board
        displayController.addSquareClickHandler(handlePlayerMove);
    };

    const init = () => {
        displayController.render();
        displayController.setMessageHandler(`${currentPlayer.name}'s turn`);
        displayController.addSquareClickHandler(handlePlayerMove);
        displayController.addSetNameHandler(displayController.showDialog);
        displayController.handleNameSubmission(setNames)
        displayController.addRestartHandler(restartGame);
    };

    return { init };


  
})();

const displayController = (() => {
    const boardElement = document.getElementById("game-board");
    const messageElement = document.getElementById("message");
    const restartButton = document.getElementById("restart-button");
    const setNamesButton = document.getElementById("set-name-button");
    const titleElements = document.getElementsByTagName("h1");

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
    
    const setTitleHandler = (message) => {
        titleElements[0].textContent = message;
    }

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

    const addSetNameHandler = (showDialogHandler) => {
        setNamesButton.addEventListener("click", showDialogHandler)
    }

    const handleNameSubmission = (submitHandler) => {
        const dialog = document.getElementById("name-dialog");
        const submitButton = document.getElementById("submit-names");
        submitButton.addEventListener("click", (e) => {
            const player1name = document.getElementById("player-1-name").value;
            const player2name = document.getElementById("player-2-name").value;
            submitHandler(player1name, player2name);
            dialog.close();
        });
        
        dialog.addEventListener("close", () => {
            // Can handle any cleanup if needed
        });
    };

    const showDialog = () => {
        document.getElementById("name-dialog").showModal();
    };


    return { render, setMessageHandler, setTitleHandler, addSquareClickHandler, addRestartHandler, addSetNameHandler, handleNameSubmission, showDialog };
})();

gameController.init();