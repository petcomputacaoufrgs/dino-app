import sleep from '../../../../../utils/SleepUtils'
import { getRandomInteger } from '../../../../../utils/RandomUtils'
import { startBackgroundEngine } from './background'

let dino: HTMLElement | null
let grid: HTMLElement | null
let container: HTMLElement | null
let scoreBoard: HTMLElement | null
let score = 0
let isJumping = false
let isGameOver = false
let isFirstJump = true
let position = 0
let onGameEnd: () => void
let handleStopBackgroundEngine: () => void

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

	return [handleStopBackgroundEngine, handleStartGame]
}

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

async function control() {
	if (dino && !isGameOver && !isJumping) {
		isJumping = true
		await jump(dino)
		isJumping = false
	}
}

async function jump(dino: HTMLElement) {
	let gravity = 1
	let y_velocity = 17
	position = 0

	//Movimento em forma de parábola
	do {
		position += y_velocity
		y_velocity -= gravity
		dino.style.transform = `translate3d(0, -${position}%, 0)`
		await sleep(20)
	}while (position > 0)

	dino.style.transform = `translate3d(0, 0, 0)`
}

async function generateObstacle() {
	let obstaclePosition = 550
	let nextObstacleGenerated = false
	let minDistance = 250
	const obstacle = document.createElement('div')
	obstacle.classList.add('dino_runner_game__obstacle')
	obstacle.style.transform = `translate3d(${obstaclePosition}%, 0, 0)`
	grid!.appendChild(obstacle)

	if(isFirstJump){
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
		obstaclePosition -= 9 + (score * 0.05) // Jogo fica mais rápido de acordo com a quantidade de pontos
		obstacle.style.transform = `translate3d(${obstaclePosition}%, 0, 0)`
	}

	score++
	setScore(score)
	obstacle.remove()
}

async function generateNextObstacle() {
	if (!isGameOver) {
		const randomTime = getRandomInteger(0, 750)
		await sleep(randomTime)
		generateObstacle()
	}
}

function setScore(score: number) {
	if (scoreBoard) {
		scoreBoard!.innerHTML = `<p>${score}</p>`
	}
}
