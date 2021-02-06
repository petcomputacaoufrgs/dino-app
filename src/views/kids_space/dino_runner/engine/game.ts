import sleep from "../../../../utils/SleepUtils"
import { getRandomInteger } from '../../../../utils/RandomUtils'
import { startBackgroundEngine } from "./background"

let dino: HTMLElement | null
let grid: HTMLElement | null
let container: HTMLElement | null
let scoreBoard: HTMLElement | null
let score = 0
let isJumping = false
let isGameOver = false
let position = 0
let onGameEnd: () => void
let handleStopBackgroundEngine: () => void 

export function startDinoRunnerGame(
    handleGameEnd: () => void, 
    dinoContainer: HTMLDivElement,
    dinoGrid: HTMLDivElement,
    character: HTMLDivElement,
    dinoScoreBoard: HTMLDivElement) {

    onGameEnd = handleGameEnd

    dino = character
    grid = dinoGrid
    container = dinoContainer
    scoreBoard = dinoScoreBoard

    return [handleStopBackgroundEngine, handleStartGame]
}

function handleStartGame() {
    isJumping = false
    isGameOver = false
    position = 0
    score = 0

    handleStopBackgroundEngine = startBackgroundEngine()
    if (dino && grid && container) {
        container.onclick = control 
        generateObstacle()
    }
}

async function control() {
    if(dino && !isGameOver && !isJumping){
        isJumping = true
        await jump(dino)
        isJumping = false
    }
}

async function jump(dino: HTMLElement) {
    let gravity = 15
    position = 0

    //move up
    while(position < 150) {
        await sleep(20)
        position = position + gravity
        gravity = gravity * 0.95
        dino.style.transform = `translate3d(0, -${position}%, 0)`
    }

    gravity = 10
    // move down
    while(position > 0) {
        await sleep(20)
        position = position - gravity
        gravity = gravity * 1.05
        dino.style.transform = `translate3d(0, -${position}%, 0)`
    }

    dino.style.transform = `translate3d(0, 0, 0)`
}

async function generateObstacle() {
    let obstaclePosition = 500
    let nextObstacleGenerated = false
    let minDistance = 150
    const obstacle = document.createElement('div')
    obstacle.classList.add('dino_runner_game__obstacle')
    obstacle.style.transform = `translate3d(${obstaclePosition}%, 0, 0)`
    grid!.appendChild(obstacle)
    
    while (obstaclePosition >= -300) {
        if (!nextObstacleGenerated && obstaclePosition < minDistance*-1) {
            nextObstacleGenerated = true    
            generateNextObstacle()
        }

        const hasCollision = obstaclePosition > -160 && obstaclePosition < -50 && position < 50

        if (isGameOver) break

        if (hasCollision) {
            isGameOver = true
            handleStopBackgroundEngine()
            onGameEnd()
            break
        }

        await sleep(20)
        obstaclePosition -= 12.5
        obstacle.style.transform = `translate3d(${obstaclePosition}%, 0, 0)`
    }

    score++
    if (minDistance > -100) minDistance-=25
    scoreBoard!.innerHTML = `<p>${score}</p>`
    obstacle.remove()
}

async function generateNextObstacle() {
    if (!isGameOver) {
        const randomTime = getRandomInteger(0, 200)
        await sleep(randomTime)
        generateObstacle()
    }
}

