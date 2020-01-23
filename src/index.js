import React from 'react';
import ReactDOM from 'react-dom';

import * as Api from './service.js'

// The computer updates the display when it is done thinking
export function updateDisplay(gamestate) {
    displayBoard(gamestate)
}

// When an inserter is clicked, a piece is inserted in the column of this button
function handleInserterClick(id, gamestate) {
    if (!gamestate.gameOver && !gamestate.computerIsThinking) {// Don't play when the computer is thinking
        gamestate = Api.playMove(gamestate.currentPlayer, id)
        updateDisplay(gamestate)
        setTimeout(() => {
            if (gamestate.currentPlayer === -1) {
                const computerBestMove = Api.getComputerBestMove(gamestate.currentPlayer)
                gamestate = Api.playMove(gamestate.currentPlayer, computerBestMove)
                updateDisplay(gamestate)
            }
        }, 0)
    }
}

// When clicking on 'Start new game' button
function handleNewGameClick() {
    const gamestate = Api.startNewGame()
    displayBoard(gamestate)
}

// Displays a square of the board
function DisplaySquare(props) {
    const square = props.square
    const gamestate = props.gamestate
    const squareId = props.id
    if (gamestate.winningSquares.includes(squareId)) {
        if (square === 1)
            return <td style={{width: '60px', height: '60px', borderRadius: '50%', border: '2px solid blue', background: 'red'}}></td>
        else if (square === 0)
            return <td style={{width: '60px', height: '60px', borderRadius: '50%', border: '2px solid blue'}}></td>
        else
            return <td style={{width: '60px', height: '60px', borderRadius: '50%', border: '2px solid blue', background: 'yellow'}}></td>
    } else {
        if (square === 1)
            return <td style={{width: '60px', height: '60px', borderRadius: '50%', border: '2px solid black', background: 'red'}}></td>
        else if (square === 0)
            return <td style={{width: '60px', height: '60px', borderRadius: '50%', border: '2px solid black'}}></td>
        else
            return <td style={{width: '60px', height: '60px', borderRadius: '50%', border: '2px solid black', background: 'yellow'}}></td>
    }
    
}

// Displays a whole line (a loop to display the squares)
function DisplayLine(props) {
    const line = props.line
    const lineId = props.id
    const gamestate = props.gamestate
    const items = line.map((el, index) => <DisplaySquare square={el} id={lineId*7+index} gamestate={gamestate}/>)
    return <tr>{items}</tr>
}

// Creates a button for each column : clicking on the button puts a piece in the column
function DisplayInserter(props) {
    const inserterId = props.id
    const gamestate = props.gamestate
    return gamestate.lastColumnPlayed === inserterId
        ? <td
            style={{width: 0, height: 0, borderLeft: '32px solid transparent', borderRight: '32px solid transparent', borderTop: '53px solid blue'}}
            onClick={() => handleInserterClick(inserterId, gamestate)}
        ></td>
        : <td
            style={{width: 0, height: 0, borderLeft: '32px solid transparent', borderRight: '32px solid transparent', borderTop: '53px solid green'}}
            onClick={() => handleInserterClick(inserterId, gamestate)}
        ></td>
}

// Displays the whole board
function displayBoard(gamestate) {
    const element = (
        <div>
            <table>
                <td>
                    <table>
                        {[0,1,2,3,4,5,6].map(id => <DisplayInserter id={id} gamestate={gamestate}/>)}
                    </table>
                    <table style={{border: '2px solid black'}}>
                        {gamestate.board.map((line, index) => <DisplayLine line={line} id={index} gamestate={gamestate}/>)}
                    </table>
                </td>
                <td>
                    {gamestate.redPlayerHasWon ? <div><b style={{color: 'red'}}>THE RED PLAYER HAS WON !</b></div> : <div></div>}
                    {gamestate.yellowPlayerHasWon ? <div><b style={{color: 'yellow'}}>THE YELLOW PLAYER HAS WON !</b></div> : <div></div>}
                    <div>Next player to play is : {gamestate.currentPlayer === 1 ? <b style={{color: 'red'}}>RED</b> : <b style={{color: 'yellow'}}>YELLOW</b>}</div>
                    {gamestate.computerIsThinking ? <div>The computer is thinking about its next move...</div> : <div></div>}
                    {gamestate.playerClickedOnWrongColumn ? <div>Please click on an empty column</div> : <div></div>}
                    <button onClick={() => handleNewGameClick()}>START NEW GAME</button>
                </td>
            </table>
        </div>
    )
    ReactDOM.render(element, document.getElementById('root'))
}

const startingGame = Api.startNewGame()
displayBoard(startingGame)
