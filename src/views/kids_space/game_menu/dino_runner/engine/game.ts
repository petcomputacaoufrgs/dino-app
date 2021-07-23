import sleep from '../../../../../utils/SleepUtils'
import { getRandomInteger } from '../../../../../utils/RandomUtils'
import { startBackgroundEngine } from './background'

//#region Constants
// Elements to keep track of
let goBackButton: Element
let dino: HTMLElement | null
let grid: HTMLElement | null
let container: HTMLElement | null
let scoreBoard: HTMLElement | null

// Score
let score = 0

// Control states
let isJumping = false
let isGameOver = false
let isFirstJump = true

// Que porra é essa?
let position = 0

// Functions to handle events
let onGameEnd: () => void
let handleStopBackgroundEngine: () => void
//#endregion

/**
 * @description set all HTML elements and events
 * @param handleGameEnd div where the game renders
 * @param dinoContainer div where the game renders
 * @param dinoGrid div containg the game grid 
 * @param character div containg the character
 * @param dinoScoreBoard div containing the score display
 * @return list with the functions to handle the start of game and to handle the stop of animation
 */
export function startDinoRunnerGame(
	handleGameEnd: () => void,
	dinoContainer: HTMLDivElement,
	dinoGrid: HTMLDivElement,
	character: HTMLDivElement,
	dinoScoreBoard: HTMLDivElement,
) {
	onGameEnd = handleGameEnd
	dino = character
	grid = dinoGrid
	container = dinoContainer
	scoreBoard = dinoScoreBoard
	setScore(0)

	goBackButton = document.getElementsByClassName('dino_icon_button')[0]
	goBackButton.addEventListener('click', () => {
		isJumping = false
		isFirstJump = true
		position = 0

		dino = null
		grid = null
		container = null
		scoreBoard = null
	})

	return [handleStopBackgroundEngine, handleStartGame]
}

/**
 * @description set variables to start the game, start animations and generate obstacles
 */
function handleStartGame() {
	isJumping = false
	isGameOver = false
	isFirstJump = true
	position = 0
	score = 0
	setScore(0)

	handleStopBackgroundEngine = startBackgroundEngine()
	if (dino && grid && container) {
		container.onpointerdown = control
		generateObstacle()
	}
}

/**
 * @description verify if the character is jumping or not
 */
async function control() {
	if (dino && !isGameOver && !isJumping) {
		isJumping = true
		await jump(dino)
		isJumping = false
	}
}

/**
 * @description make the jump animation
 * @param dino div containing the character
 */
async function jump(dino: HTMLElement) {
	let gravity = 1
	let y_velocity = 17
	position = 0

	do {
		// projectile motion
		position += y_velocity
		y_velocity -= gravity
		dino.style.transform = `translate3d(0, -${position}%, 0)`
		await sleep(20)
	} while (position > 0)

	dino.style.transform = `translate3d(0, 0, 0)`
}

/**
 * @description generate a new obstacle in the screen and control the score
 */
async function generateObstacle() {
	let increaseSpeed = 0
	let obstaclePosition = 550
	let nextObstacleGenerated = false
	let minDistance = 250
	const obstacle = document.createElement('div')
	obstacle.classList.add('dino_runner_game__obstacle')
	obstacle.style.transform = `translate3d(${obstaclePosition}%, 0, 0)`

	if (grid) {
		grid.appendChild(obstacle)

		if (isFirstJump) {
			obstaclePosition = 1000 //dá um tempo melhor para o jogador pensar no primeiro pulo
			isFirstJump = false
		}

		while (obstaclePosition >= -300) {
			if (!nextObstacleGenerated && obstaclePosition < minDistance * -1) {
				nextObstacleGenerated = true
				generateNextObstacle()
			}

			const hasCollision =
				obstaclePosition > -160 && obstaclePosition < -50 && position < 50

			if (isGameOver) break

			if (hasCollision) {
				isGameOver = true
				handleStopBackgroundEngine()
				onGameEnd()
				break
			}

			await sleep(20)
			if (increaseSpeed < 7.5) increaseSpeed = score * 0.15 // Limite de velocidade
			obstaclePosition -= 11 + increaseSpeed // Jogo fica mais rápido de acordo com a quantidade de pontos
			obstacle.style.transform = `translate3d(${obstaclePosition}%, 0, 0)`
		}

		score++
		setScore(score)
		obstacle.remove()
	}

}

/**
 * @description set an interval to call the next obstacle
 */
async function generateNextObstacle() {
	if (!isGameOver) {
		const randomTime = getRandomInteger(0, 800)
		await sleep(randomTime)
		generateObstacle()
	}
}

/**
 * @description display the current score on screen
 */
function setScore(score: number) {
	if (scoreBoard) {
		scoreBoard!.innerHTML = `<p>${score}</p>`
	}
}