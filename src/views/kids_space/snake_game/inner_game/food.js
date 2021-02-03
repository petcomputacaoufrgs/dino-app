/* --> Imports <-- */
import { foodAte, onSnake, growSnake } from './snake.js'
import FOOD from '../../../../assets/kids_space/snake/food.png'

/* --> Constants <-- */
// Board
const GRID_SIZE = 21

// Food
let food = getRandomFoodPosition()

// Score
export let score = 0


/* --> Functions <-- */
// updateFood(): if the food was ate, the score is updated and the flag to grow the snake is activated
export function updateFood() {
    if(foodAte(food)) {
        growSnake()
        food = getRandomFoodPosition()
        score += 1
    }
}

// renderFood(gameBoard): render the food on the board
//  input: gameBoard -> html element : div where the game renders
export function renderFood(gameBoard) {
    const foodElement = document.createElement('IMG')

    // Set all attributes
    foodElement.setAttribute("src", FOOD)
    foodElement.style.gridRowStart = food.y
    foodElement.style.gridColumnStart = food.x
    foodElement.classList.add('food')

    // Append the segment to the board
    gameBoard.appendChild(foodElement)
}

// getRandomFoodPosition(): get a random position that not colides with the snake for the new food
//  output: newFooPosition -> { x , y } : the position of the new food
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