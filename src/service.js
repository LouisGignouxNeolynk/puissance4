/*
    This files handles api calls, one function per call
*/

// Start a new game
export function startNewGame() {
    const xmlHttp = new XMLHttpRequest()
    xmlHttp.open('GET', 'http://localhost:3000/api/newGame', false)
    xmlHttp.send(null)
    const gamestate = JSON.parse(xmlHttp.response)
    return gamestate
}

// Play a move on a certain column with a certain color
export function playMove(color, columnId) {
    const xmlHttp = new XMLHttpRequest()
    xmlHttp.open('POST', 'http://localhost:3000/api/player/' + color + '/play/' + columnId, false)
    xmlHttp.send(null)
    const gamestate = JSON.parse(xmlHttp.response)
    return gamestate
}

// Fetches computer best move
export function getComputerBestMove(color) {
    const xmlHttp = new XMLHttpRequest()
    xmlHttp.open('GET', 'http://localhost:3000/api/computerMove/' + color, false)
    xmlHttp.send(null)
    const response = JSON.parse(xmlHttp.response)
    return response.bestMove
}