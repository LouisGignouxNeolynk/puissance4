const express = require('express')
const router = express.Router()

const Algorithm = require('../api/algorithm')
const Board = require('../api/board')

// Change the current player
function moveOnToNextPlayer(gamestate) {
    gamestate.currentPlayer = -gamestate.currentPlayer
    gamestate.computerIsThinking = !gamestate.computerIsThinking
}

// Start a new game
function resetGamestate() {
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

let gamestate

// This route is called to start a new game
router.get('/api/newGame', (req, res) => {
    gamestate = resetGamestate()
    res.send(gamestate)
})

// This route is called when a human player tries to play (clicks on a column)
router.post('/api/player/:color/play/:columnId', (req, res) => {
    const columnId = req.params.columnId
    const color = parseInt(req.params.color)
    if (Board.isThereRoomLeftInColumn(columnId, gamestate.board)) {
        gamestate.playerClickedOnWrongColumn = false
        gamestate.board = Board.addPieceInColumn(columnId, color, gamestate.board)
        gamestate.lastColumnPlayed = columnId
        if (Algorithm.hasPlayerWon(color, gamestate.board)) {
            if (color === 1)
                gamestate.redPlayerHasWon = true
            else
                gamestate.yellowPlayerHasWon = true
            gamestate.gameOver = true
            Board.highlightWinningSquares(color, gamestate.board, gamestate)
        }
        moveOnToNextPlayer(gamestate)
    } else {
        gamestate.playerClickedOnWrongColumn = true
    }
    
    res.send(gamestate)
})

// This route is called to get the best computer move in a given position
router.get('/api/computerMove/:color', (req, res) => {
    const color = parseInt(req.params.color)
    const bestMove = Algorithm.runComputerMove(color, gamestate.board)
    res.send({bestMove})
})

module.exports = router
