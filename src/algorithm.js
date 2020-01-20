import * as Board from './board.js'

// The best possible position : the player has won
const maxNote = 1000

/*
    The alphabeta algorithm sets a few parameters at -infinity, in this case -3000 is enough since the worst possible value
    (player has lost) is -1000
*/
const startingNote = -3000

// the maximum depth of research : the computer can "see" maxDepth moves in advance
const maxDepth = 10

// The computer searches its best possible moves through a couple of algorithms
export function runComputerMove(color, board) {
    const legalMoves = generateLegalMoves(board)
        .map(move => ({ column: move, note: 0 }))

    /*
        We use an iterative deepening algorithm : we check moves at a certain depth then reorder the moves so that the best
        (at this given depth) is first, then we extend the depth
        The point is that alphabeta is most optimal when the best move is tested first, so we try to anticipate which move is best
        at depth n by finding the best move ath depth n-1
        This has little impact with performance since the longest research is the one at max depth (by a factor of 7 in worst case)

        To evaluate a move, the computer plays it, evaluates it then restores the board to its 'pre-move' state
        The restoration is handled by the function Board.undoLastMove
    */
    for (let depth = 1; depth <= maxDepth; depth++) {
        for (let i = 0; i < legalMoves.length; i++) {
            board = Board.addPieceInColumn(legalMoves[i].column, color, board)
            legalMoves[i].note = alphabetaSearch(board, -color, depth-1)
            board = Board.undoLastMove(legalMoves[i].column, board)
        }
        legalMoves.sort((move1, move2) => move2.note-move1.note)
    }
    
    // Select the best move and play it, we are done
    const bestMove = legalMoves[0]
    return bestMove.column
}

function alphabetaSearch(board, color, depth, alpha=startingNote, beta=-startingNote) {
    // No need to search further if victory is achieved
    if (hasPlayerWon(-color, board))
        return maxNote
    // If depth = 0, we evaluate the position and don't search further
    if (depth === 0)
        return evaluate(-color, board)
    const legalMoves = generateLegalMoves(board)
    // It seems the game ended with a draw
    if (legalMoves.length === 0)
        return 0
    let note = startingNote
    for (let i = 0; i < legalMoves.length; i++) {
        board = Board.addPieceInColumn(legalMoves[i], color, board)
        // Check if this move is better than one of the precedents
        note = Math.max(note, alphabetaSearch(board, -color, depth-1, -beta, -alpha))
        alpha = Math.max(alpha, note)
        board = Board.undoLastMove(legalMoves[i], board)

        /*
            Check if the move is gonna be cut by alphabeta algorithm to save some time
            For more infos about alphabeta algorithm, check : https://en.wikipedia.org/wiki/Alpha-beta_pruning
        */
        if (alpha >= beta)
            break
    }
    return -note
}

// We can spare little time by removing impossible moves
function generateLegalMoves(board) {
    return [0,1,2,3,4,5,6].filter(column => Board.isThereRoomLeftInColumn(column, board))
}

// Check if the player has won
export function hasPlayerWon(color, board) {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 7; j++) {
            // Searches for columns of 4
            if (board[i][j] === color && board[i+1][j] === color && board[i+2][j] === color && board[i+3][j] === color)
                return true
            // Searches for lines of 4
            if (board[j][i] === color && board[j][i+1] === color && board[j][i+2] === color && board[j][i+3] === color)
                return true
            // Searches for diagonals of 4
            if (j < 4) {
                if (board[i][j] === color && board[i+1][j+1] === color && board[i+2][j+2] === color && board[i+3][j+3] === color)
                    return true
            }
            if (j > 3) {
                if (board[i][j] === color && board[i+1][j-1] === color && board[i+2][j-2] === color && board[i+3][j-3] === color)
                    return true
            }
        }
    }
}

/*
    this function evaluates the position
    Since p4 is a relatively simple game, it does not need to be very advanced
*/
function evaluate(color, board) {
    let note = 0
    // The further a piece is from the center of the board, the less valuable it is
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
            if (board[i][j] === color)
                note -= (Math.abs(3-j) + Math.abs(3-i))
            else if (board[i][j] === -color)
                note += (Math.abs(3-j) + Math.abs(3-i))
        }
    }
    return note
}