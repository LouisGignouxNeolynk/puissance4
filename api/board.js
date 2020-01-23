// Create board at the start of the game
function initNewBoard() {
    return [
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0]
    ]
}

// Check if it is possible to add a piece in a given column
function isThereRoomLeftInColumn(column, board) {
    return board[0][column] === 0
}

// Undoes last move (remove top piece from the given column)
function undoLastMove(column, board) {
    let i = 0
    while(board[i][column] === 0) {
        i++
    }
    board[i][column] = 0
    return board
}

// Plays a move
function addPieceInColumn(column, color, board) {
    let i = 6
    while(board[i][column] !== 0) {
        i--
    }
    board[i][column] = color
    return board
}

// If a player has won, we colorize winning squares
function highlightWinningSquares(color, board, gamestate) {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 7; j++) {
            // Searches for columns of 4
            if (board[i][j] === color && board[i+1][j] === color && board[i+2][j] === color && board[i+3][j] === color)
                gamestate.winningSquares = [i*7+j, (i+1)*7+j, (i+2)*7+j, (i+3)*7+j]
            // Searches for lines of 4
            if (board[j][i] === color && board[j][i+1] === color && board[j][i+2] === color && board[j][i+3] === color)
                gamestate.winningSquares = [j*7+i, j*7+i+1, j*7+i+2, j*7+i+3]
            // Searches for diagonals of 4
            if (j < 4) {
                if (board[i][j] === color && board[i+1][j+1] === color && board[i+2][j+2] === color && board[i+3][j+3] === color)
                    gamestate.winningSquares = [i*7+j, (i+1)*7+j+1, (i+2)*7+j+2, (i+3)*7+j+3]
            }
            if (j > 3) {
                if (board[i][j] === color && board[i+1][j-1] === color && board[i+2][j-2] === color && board[i+3][j-3] === color)
                    gamestate.winningSquares = [i*7+j, (i+1)*7+j-1, (i+2)*7+j-2, (i+3)*7+j-3]
            }
        }
    }
}

module.exports = {
    addPieceInColumn,
    highlightWinningSquares,
    initNewBoard,
    isThereRoomLeftInColumn,
    undoLastMove
}