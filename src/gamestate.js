import * as Algorithm from './algorithm.js'
import * as Board from './board.js'
import * as Main from './index.js'

// A mix of variables to describe the game state
export function initNewGamestate() {
    return {
        board: Board.initNewBoard(),
        computerIsThinking: false,
        currentPlayer: 1,
        gameOver: false,
        lastColumnPlayed: -1,
        playerClickedOnWrongColumn: false,
        winningSquares: [],

        yellowPlayerHasWon: false,
        redPlayerHasWon: false
    }
}

// Change the current player
function moveOnToNextPlayer(gamestate) {
    gamestate.currentPlayer = -gamestate.currentPlayer
    gamestate.computerIsThinking = !gamestate.computerIsThinking
}

// The human player plays a move
export function humanPlays(column, gamestate) {
    if (Board.isThereRoomLeftInColumn(column, gamestate.board)) {
        gamestate.playerClickedOnWrongColumn = false
        gamestate.board = Board.addPieceInColumn(column, gamestate.currentPlayer, gamestate.board)
        gamestate.lastColumnPlayed = column
        if (Algorithm.hasPlayerWon(1, gamestate.board)) {
            gamestate.redPlayerHasWon = true
            gamestate.gameOver = true
            Board.highlightWinningSquares(1, gamestate.board, gamestate)
        }
        if (Algorithm.hasPlayerWon(-1, gamestate.board)) {
            gamestate.yellowPlayerHasWon = true
            gamestate.gameOver = true
            Board.highlightWinningSquares(-1, gamestate.board, gamestate)
        }
        moveOnToNextPlayer(gamestate)
        setTimeout(
            () => computerPlays(gamestate),
            200
        )
    } else {
        gamestate.playerClickedOnWrongColumn = true
    }
    Main.updateDisplay(gamestate)
}

// The computer plays a move
async function computerPlays(gamestate) {
    // Start reflexion : lock the board
    Main.updateDisplay(gamestate)

    const computerChosenMove = Algorithm.runComputerMove(-1, gamestate.board)
    gamestate.board = Board.addPieceInColumn(computerChosenMove, gamestate.currentPlayer, gamestate.board)
    gamestate.lastColumnPlayed = computerChosenMove
    if (Algorithm.hasPlayerWon(1, gamestate.board)) {
        gamestate.redPlayerHasWon = true
        gamestate.gameOver = true
        Board.highlightWinningSquares(1, gamestate.board, gamestate)
    }
    if (Algorithm.hasPlayerWon(-1, gamestate.board)) {
        gamestate.yellowPlayerHasWon = true
        gamestate.gameOver = true
        Board.highlightWinningSquares(-1, gamestate.board, gamestate)
    }
    moveOnToNextPlayer(gamestate)

    // End Reflexion : unlock the board and displays the result
    Main.updateDisplay(gamestate)
}
