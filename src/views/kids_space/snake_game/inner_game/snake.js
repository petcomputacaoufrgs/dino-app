/* --> Imports <-- */
import { getInputDirection } from './input.js'

import HEAD_UP from '../../../../assets/kids_space/snake/head_up.png'
import HEAD_DOWN from '../../../../assets/kids_space/snake/head_down.png'
import HEAD_LEFT from '../../../../assets/kids_space/snake/head_left.png'
import HEAD_RIGHT from '../../../../assets/kids_space/snake/head_right.png'
import BODY_H from '../../../../assets/kids_space/snake/body_h.png'
import BODY_V from '../../../../assets/kids_space/snake/body_v.png'
import CURVE_DL from '../../../../assets/kids_space/snake/curve_dl.png'
import CURVE_DR from '../../../../assets/kids_space/snake/curve_dr.png'
import CURVE_UL from '../../../../assets/kids_space/snake/curve_ul.png'
import CURVE_UR from '../../../../assets/kids_space/snake/curve_ur.png'
import RABA_UP from '../../../../assets/kids_space/snake/raba_up.png'
import RABA_DOWN from '../../../../assets/kids_space/snake/raba_down.png'
import RABA_LEFT from '../../../../assets/kids_space/snake/raba_left.png'
import RABA_RIGHT from '../../../../assets/kids_space/snake/raba_right.png'


/* --> Constants <-- */
// Board
const GRID_SIZE = 21

// Snake
const snakeBody = [{ x: 11, y: 11 }, {x: 11, y: 12}]
let grow = false
let started = false


/* --> Functions <-- */
// updateSnake(): update the snake vector with the new segment position at each time interval
export function updateSnake() {
    if(grow) {
        addSegments()
    }
    // Get the head direction (changed by the user)
    const inputDirection = getInputDirection()

    // Update the array -> the current segment gets the position of the previous segment
    for (let i = snakeBody.length - 2; i >= 0; i--) {
        snakeBody[i + 1] = { ...snakeBody[i] }
    }

    /* BUG */
    // Gambiarra: o jogo buga quando tem mais de um segmento inicial
    if(!started) {
        if(!(inputDirection.x === 0 && inputDirection.y === 0)) {
            started = true
        } else {
            if(snakeBody.length === 2){
                snakeBody[1].y = 12
            }
        }
    }

    // Update the head position
    snakeBody[0].x += inputDirection.x
    snakeBody[0].y += inputDirection.y
}

// renderSnake(gameBoard): render the snake array on the board
//  input: gameBoard -> html element : div where the game renders
export function renderSnake(gameBoard) {
    // Render each segment
    snakeBody.forEach((segment, index) => {
        const snakePiece = document.createElement('IMG')
        const image = getCorrectImage(index)    // get the correct sprite according the segment position

        // Set all attributes
        snakePiece.setAttribute("src", image)
        snakePiece.style.gridRowStart = segment.y
        snakePiece.style.gridColumnStart = segment.x
        snakePiece.classList.add('snake')

        // Append the segment to the board
        gameBoard.appendChild(snakePiece)
    })
}

// foodAte(position): verify if the food was ate
//  input: position -> { x , y } : the position of the current food
//  output: boolean :
//      true -> food was ate
//      false -> food is still there
export function foodAte(position) {
    return snakeBody[0].x === position.x && snakeBody[0].y === position.y
}

// onSnake(position, ignoreHead): verify if some position is in the same position as some part of the snake body
// input: position -> { x , y } : the position that will be tested
//        ignoreHead -> tells if is necessary to ignore the head (this function is used to verify if the snake is over itself)
// output: boolean :
//      true -> the position overlaps the snake
//      false -> the postion don't overlap the snake
export function onSnake(position, ignoreHead = false) {
    return snakeBody.some((segment, index) => {
        if (ignoreHead && index === 0) {
            return false
        } else {
            return segment.x === position.x && segment.y === position.y
        }
    })
}

// growSnake(): set the boolean grow to true
export function growSnake() {
    grow = true
}

// addSegments(): add a new segment on the snake array and sets the boolean grow to false
export function addSegments() {
    snakeBody.push({ ...snakeBody[snakeBody.length - 1] })
    grow = false
}

// outsideGrid(): verify if the snake is outside of the board grid
//  output: boolean :
//      true -> the snake is outside the grid
//      false -> the snake is inside the grid
export function outsideGrid() {
    return snakeBody[0].x < 1 || snakeBody[0].x > GRID_SIZE || snakeBody[0].y < 1 || snakeBody[0].y > GRID_SIZE
}

// snakeOverItself(): verify if the head colided with some part of the snake
//  output: boolean :
//      true -> the snake colided with itself
//      false -> the snake don't colided
export function snakeOverItself() {
    return onSnake(snakeBody[0], true)
}

// getCorrectImage(index): get the correct asset based on the position of the current and adjacent segments
//  input: index -> number : index of the segment on the array
//  output: imgUrl -> string : directory of the image needed
function getCorrectImage(index) {
    const inputDirection = getInputDirection()
    
    // Segment is a head
    if (index === 0) {

        switch (inputDirection.d) {

            case 'D':

                return HEAD_DOWN

            case 'L':

                return HEAD_LEFT

            case 'R':

                return HEAD_RIGHT

            default:

                return HEAD_UP

        }



        // Segment is a tail

    } else if (index === snakeBody.length - 1) {

        if (snakeBody[index - 1].x > snakeBody[index].x) {

            return RABA_LEFT

        } else if (snakeBody[index - 1].x < snakeBody[index].x) {

            return RABA_RIGHT

        } else if (snakeBody[index - 1].y > snakeBody[index].y) {

            return RABA_UP

        } else {

            return RABA_DOWN

        }



        // Segment is in the between

    } else {

        // Straight piece

        if (snakeBody[index - 1].x === snakeBody[index].x && snakeBody[index].x === snakeBody[index + 1].x) {

            return BODY_V

        } else if (snakeBody[index - 1].y === snakeBody[index].y && snakeBody[index].y === snakeBody[index + 1].y) {

            return BODY_H

            // Curved piece

        } else {

            if ((snakeBody[index - 1].y === snakeBody[index].y && snakeBody[index - 1].x === (snakeBody[index].x - 1) && snakeBody[index].x === snakeBody[index + 1].x && snakeBody[index].y === (snakeBody[index + 1].y - 1)) ||

                (snakeBody[index - 1].x === snakeBody[index].x && snakeBody[index].y === (snakeBody[index - 1].y - 1) && snakeBody[index].y === snakeBody[index + 1].y && snakeBody[index + 1].x === (snakeBody[index].x - 1))) {

                return CURVE_DL

            } else if ((snakeBody[index - 1].x === snakeBody[index].x && snakeBody[index - 1].y === (snakeBody[index].y + 1) && snakeBody[index].y === snakeBody[index + 1].y && snakeBody[index].x === (snakeBody[index + 1].x - 1)) ||

                (snakeBody[index - 1].y === snakeBody[index].y && snakeBody[index].x === (snakeBody[index - 1].x - 1) && snakeBody[index].x === snakeBody[index + 1].x && snakeBody[index + 1].y === (snakeBody[index].y + 1))) {

                return CURVE_DR

            } else if (snakeBody[index - 1].x === (snakeBody[index].x - 1) || snakeBody[index + 1].x === (snakeBody[index].x - 1)) {

                return CURVE_UL

            } else {

                return CURVE_UR

            }

        }

    }
}