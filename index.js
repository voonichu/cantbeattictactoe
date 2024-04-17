const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");

// List of all win conditions in Tic Tac Toe
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

let options = ["", "", "", "", "", "", "", "", ""]; // Empty board
let currentPlayer = "X"; // Sets current player to X
let running = false; // Sets default game state to false

initializeGame();

function initializeGame() {
    cells.forEach(cell => cell.addEventListener("click", cellClicked)); // Adds event listener to check for when cells are clicked
    restartBtn.addEventListener("click", restartGame); // Adds event listener for when restart button is clicked
    statusText.textContent = `${currentPlayer}'s turn`; // Text to indicate which player's turn it is
    running = true; // Sets game state to true
}

function cellClicked() {
    const cellIndex = this.getAttribute("cellIndex"); // Gets the cellIndex attribute from html file (figures out what cell it is)

    if (options[cellIndex] != "" || !running) {
        return; // Returns if cell is full or game is not running
    }

    updateCell(this, cellIndex); // Updates cell to currnet player's move
    checkWinner(); // Calls check winner to check if a player has won (or if there is a draw)

}

function updateCell(cell, index) {
    options[index] = currentPlayer; // Inserts index (currentPlayer) into cell
    cell.textContent = currentPlayer; // Shows the text of currentPlayer
}

function changePlayer() {
    currentPlayer = (currentPlayer == "X") ? "O" : "X"; // Logic to detect if currnetPlayer should update to X or O
    statusText.textContent = `${currentPlayer}'s turn`; // Displays currnetPlayer to user
}

function checkWinner() {
    let roundWon = false; // Sets default win state to false

    // For loop that checks if 3 cells in a row are matching (from win condition) and sets winner/draw or continues
    for (let i = 0; i < winConditions.length; i++) {
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if (cellA == "" || cellB == "" || cellC == "") {
            continue;
        }
        if (cellA == cellB && cellB == cellC) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `${currentPlayer} wins!`;
        running = false;
    }
    else if (!options.includes("")) {
        statusText.textContent = `Draw`;
    }
    else {
        changePlayer();
    }
}

function restartGame() {
    // Restarts game
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = "");
    running = true;
}