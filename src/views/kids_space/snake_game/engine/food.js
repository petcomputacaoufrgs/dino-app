import { foodAte, onSnake, growSnake } from './snake.js'
import FOOD from '../../../../assets/kids_space/snake/food.png'

//#region Constants

// Board
const GRID_SIZE = 21

// Food
let food = getRandomFoodPosition()

// Score
export let score = 0

//#endregion

//#region Functions

/**
 * @description if the food was ate, the score is updated and the flag to grow the snake is activated
 */
export function updateFood() {
    if(foodAte(food)) {
        growSnake()
        food = getRandomFoodPosition()
        score += 1
        return true
    }

    return false
}

/**
 * @description render the food on the board
 * @param gameBoard div where the game renders
 */
export function renderFood(gameBoard) {
    const foodElement = document.createElement('IMG')

    // Set all attributes
    foodElement.setAttribute("src", FOOD)
    foodElement.style.gridRowStart = food.y
    foodElement.style.gridColumnStart = food.x
    foodElement.classList.add('snake_game__food')

    // Append the segment to the board
    gameBoard.appendChild(foodElement)
}

/**
 * @description get a random position that not colides with the snake for the new food
 * @returns the position of the new food
 */
function getRandomFoodPosition() {
    let newFoodPosition

    while(newFoodPosition == null || onSnake(newFoodPosition)){
        newFoodPosition = {
            x: Math.floor(Math.random() * GRID_SIZE) + 1,
            y: Math.floor(Math.random() * GRID_SIZE) + 1
        }
    }

    return newFoodPosition
}

/**
 * @description clear food variables
 */
export function resetFood() {
    score = 0
}

//#endregion