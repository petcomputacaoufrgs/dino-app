import { renderSnake, outsideGrid, snakeOverItself, updateSnake, resetSnake } from './snake.js'
import { updateFood, renderFood, score, resetFood } from './food.js'
import { resetInput } from './input'

//#region Constants

//HTML Elements
let gameBoard
let scoreBoard

//General attirbutes
let gameOver = false
let firstRender = true

//Snake
const SNAKE_SPEED = 150

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
    removeSnakeFromBoard()
    removeFoodFromBoard()
    setDefaultVars(handleGameOver)
    setTimeout(main, SNAKE_SPEED)
}

/**
 * @description Set default variables values
 * @param handleGameOver Callback for game over event
 */
function setDefaultVars(handleGameOver) {
    firstRender = true
    gameOver = false
    onGameOver = handleGameOver
    gameBoard = document.getElementById('snake_game__game_board')
    scoreBoard = document.getElementById('snake_game__score_board')
}

/**
 * @description main function of the game; organizes and set everything needded
 * @param currentTime actual time
 */
function main() {
    // Verify if is a game over scenario
    if(gameOver) {
        onGameOver()
        return
    } 
        
    setTimeout(main, SNAKE_SPEED)        
    
    // Update and render the game
    const [snakeChanged, foodChanged] = update()
    render(snakeChanged, foodChanged)

    if (firstRender) firstRender = false
}

/**
 * @description update the food and the snake if necessary
 */
function update() {
    const snakeChanged = updateSnake()
    const foodChanged = updateFood()
    checkDeath()

    return [snakeChanged, foodChanged]
}

/**
 * @description render the snake, the food and the current score
 * @param snakeChanged true if snake position has been changed
 * @param foodChanged true if food position has been changed
 */
function render(snakeChanged, foodChanged) {
    if (gameOver) return

    scoreBoard.innerHTML = `<p>${score}</p>`
    
    if (snakeChanged) removeSnakeFromBoard()
    if (foodChanged) removeFoodFromBoard()
    if (snakeChanged || firstRender) renderSnake(gameBoard)
    if (foodChanged || firstRender) renderFood(gameBoard)
}

/**
 * @description verify if some condition of game over was reached
 */
function checkDeath() {
    gameOver = outsideGrid() || snakeOverItself()
}

/**
 * @description remove entire snake from board
 */
function removeSnakeFromBoard() {
    removeBoardElementByClassName('snake_game__snake')
}

/**
 * @description remove food from board
 */
function removeFoodFromBoard() {
    removeBoardElementByClassName('snake_game__food')
}

/**
 * @description Remove all elements on board by className
 * @param className className of itens to remove
 */
function removeBoardElementByClassName(className) {
    if (gameBoard) {
        const elements = gameBoard.getElementsByClassName(className)
        Array.from(elements).forEach(e => e.remove())
    }
}

//#endregion