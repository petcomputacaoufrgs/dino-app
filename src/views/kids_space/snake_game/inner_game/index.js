/* --> Imports <-- */
import { renderSnake, outsideGrid, snakeOverItself, updateSnake } from './snake.js'
import { updateFood, renderFood, score } from './food.js'


/* --> Constants <-- */
// HTML Elements
let gameBoard
let scoreBoard
let restartDialog
let cancelButton
let confirmButton

// General attirbutes
let lastRender = 0
let gameOver = false

// Snake
const SNAKE_SPEED = 4


/* --> Initializing the game <-- */
export default function starGame(){
    gameBoard = document.getElementById('game-board')
    scoreBoard = document.getElementById('score-board')
    restartDialog = document.getElementById('restart-dialog')
    cancelButton = document.getElementById('cancel')
    confirmButton = document.getElementById('confirm')

    restartDialog.close()
    window.requestAnimationFrame(main)
}


/* --> Functions <-- */
// main(currentTime): main function of the game; organizes and set everything needded
//  input: currentTime -> number : actual time
function main(currentTime) {
    // Verify if is a game over scenario
    if(gameOver) {
        // Check if the user would like to restart the game
        restartDialog.showModal()
        confirmButton.addEventListener('click', () => {
            console.log('ora ora')
        })
        return
    } else {
        window.requestAnimationFrame(main)

        const secondsPassed = (currentTime - lastRender) / 1000     /* Dividir por 1000 dá o resultado em segundos*/
        
        // Verify if the time passed reach the interval
        if(secondsPassed < (1 / SNAKE_SPEED)) {
            return
        }
        lastRender = currentTime
    
        // Update and render the game
        update()
        render()
    }
}

// update(): update the food and the snake if necessary
function update() {
    updateSnake()
    updateFood()
    checkDeath()
}

// render(): render the snake, the food and the current score
function render() {
    scoreBoard.innerHTML = `<p>${score}</p>`
    gameBoard.innerHTML = ''
    renderSnake(gameBoard)
    renderFood(gameBoard)
}

// checkDeath(): verify if some condition of game over was reached
function checkDeath() {
    gameOver = outsideGrid() || snakeOverItself()
}