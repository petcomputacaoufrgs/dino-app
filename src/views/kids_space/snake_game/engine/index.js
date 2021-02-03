import { renderSnake, outsideGrid, snakeOverItself, updateSnake, resetSnake } from './snake.js'
import { updateFood, renderFood, score, resetFood } from './food.js'
import { resetInput } from './input'

//#region Constants

//HTML Elements
let gameBoard
let scoreBoard

//General attirbutes
let lastRender = 0
let gameOver = false

//Snake
const SNAKE_SPEED = 4

//External function
let onGameOver

//#endregion

//#region Functions

/**
 * @description Initialize the game
 * @param handleGameOver Callback for game over event
 */
export function starGame(handleGameOver) {
    resetInput()
    resetFood()
    resetSnake()
    setDefaultVars(handleGameOver)
    window.requestAnimationFrame(main)
}

/**
 * @description Set default variables values
 * @param handleGameOver Callback for game over event
 */
function setDefaultVars(handleGameOver) {
    gameOver = false
    lastRender = 0
    onGameOver = handleGameOver
    gameBoard = document.getElementById('game-board')
    scoreBoard = document.getElementById('score-board')
}

/**
 * @description main function of the game; organizes and set everything needded
 * @param currentTime actual time
 * @returns
 */
function main(currentTime) {
    // Verify if is a game over scenario
    if(gameOver) {
        // Check if the user would like to restart the game
        onGameOver()
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

/**
 * @description update the food and the snake if necessary
 */
function update() {
    updateSnake()
    updateFood()
    checkDeath()
}

/**
 * @description render the snake, the food and the current score
 */
function render() {
    scoreBoard.innerHTML = `<p>${score}</p>`
    gameBoard.innerHTML = ''
    renderSnake(gameBoard)
    renderFood(gameBoard)
}

/**
 * @description verify if some condition of game over was reached
 */
function checkDeath() {
    gameOver = outsideGrid() || snakeOverItself()
}

//#endregion