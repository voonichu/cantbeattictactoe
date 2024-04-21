var origBoard; // Original Board
let human = 'O'; // Sets human player to O
let ai = 'X'; // Sets AI player to X
var difficulty = "none";
const winCombos = [
    // Horizontal Wins
    [0,1,2], 
    [3,4,5],
    [6,7,8],
    // Vertical Wins
    [0,3,6],
    [1,4,7],
    [2,5,8],
    // Diagnal Wins
    [0,4,8],
    [6,4,2]
];

const cells = document.querySelectorAll('.cell'); // Gets cells class from table in tictactoe.html 

//startGame(); // Runs the startGame function

function startGame() {
    document.querySelector(".startgame").style.display = "none";
    document.querySelector(".endgame").style.display = "none";
    origBoard = Array.from(Array(9).keys());
    for (var i = 0; i < cells.length; i++) {
        cells[i].addEventListener('click', turnClick, false);
    }
}

function easyMode() {
    difficulty = "easy";
    startGame();
}

function hardMode() {
    difficulty = "hard";
    startGame();
}

function selectDifficulty() {

}

function restart() {
    document.querySelector(".startgame").style.display = "block";
    document.querySelector(".endgame").style.display = "none";
    origBoard = Array.from(Array(9).keys());
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = "";
        cells[i].style.removeProperty('background-color');
    }
}

function turnClick(square) { // Function that allows human to click
    if (typeof origBoard[square.target.id] == 'number') {
        origBoard[square] = human;
        turn(square.target.id, human);
        if (difficulty == "easy") {
            if (!checkWin(origBoard, human) && !checkTie()) turn(nextSpot(origBoard), ai);
        }
        else {
            if (!checkWin(origBoard, human) && !checkTie()) turn(bestMove(origBoard), ai);
        }
        
    }
}

function turn(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origBoard, player); 
    if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) => // Looks for every index on the board that the player has played in
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) { // Loops through every win combination in winCombos
		if (win.every(elem => plays.indexOf(elem) > -1)) { // Checks if the player has played in every spot required for each win as it loops
			gameWon = {index: index, player: player}; // Sets gameWon state, including its index for stylization
			break; // Breaks from function (game has already been decided as a win)
		}
	}
	return gameWon;
}


function gameOver(gameWon) { // Stylization for win state
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor = 
        gameWon.player == human ? "blue" : "red"; // Sets background color to blue for player and red for ai
    }

    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == human ? "You win!" : "You lose."); // Declares whether the player wins or loses
}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block"; // Makes block element visible that is previously invisible 
    document.querySelector(".endgame .text").innerText = who; // Changes text to player who wins
}

function checkTie(gameWon) {
    if (!gameWon) {
        if (emptySquares().length == 0) {
            for (var i = 0; i < cells.length; i++) {
                cells[i].style.backgroundColor = "green";
                cells[i].removeEventListener('click', turnClick, false);
            }
            declareWinner("Tie Game!");
            return true;
        }
        return false;
    }

}

function emptySquares() {
    return origBoard.filter(s => typeof s == 'number');
}

function nextSpot() {
        return emptySquares() [0];
}

function bestMove(board) {
    return minimax(origBoard, ai).index;
}
    
function minimax(board, player) {
    var availSpots = emptySquares();


    if (checkWin(board, human)) {
        return {score: -10};
    } else if (checkWin(board, ai)) {
        return {score: 10};
    } else if (availSpots.length === 0) {
        return {score: 0};
    }

    var moves = []
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = board[availSpots[i]];
        board[availSpots[i]] = player;

        if (player == ai) {
            var result = minimax(board, human);
            move.score = result.score;
        } else {
            var result = minimax(board, ai);
            move.score = result.score;
        }

        board[availSpots[i]] = move.index;
        moves.push(move);
    }

    var bestMove;

    if (player === ai) {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }  
        }
    }

    return moves[bestMove];
}
