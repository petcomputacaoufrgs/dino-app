import { getRandomInteger } from '../../../../utils/RandomUtils'
import sleep from '../../../../utils/SleepUtils'

const MAX_DEGREE_REDUCTION_PER_ROTATION = 10
const INCREASE_IN_ROTATION_SPEED_PER_ROTATION = 3

export function startPaitingEngine() {
	const paiting = document.getElementById('dinogotchi__inside__paiting')

	if (paiting) {
		paiting.onclick = () => handlePaitingClick(paiting)
	}
}

async function handlePaitingClick(paiting: HTMLElement) {
	let rotateDelay = getRandomInteger(10, 15)
	let maxDegree = getRandomInteger(30, 50)
	let currentDegree

	while (isPositiveDegree(maxDegree)) {
		currentDegree = 0

		//Right
		while (isLessThanMax(maxDegree, currentDegree)) {
			await rotatePaiting(paiting, currentDegree, rotateDelay)
			currentDegree++
		}

		//Left
		while (isBiggerThanNegativeMax(maxDegree, currentDegree)) {
			await rotatePaiting(paiting, currentDegree, rotateDelay)
			currentDegree--
		}

		//Center
		while (isNotCentralized(currentDegree)) {
			await rotatePaiting(paiting, currentDegree, rotateDelay)
			currentDegree++
		}

		maxDegree = maxDegree - MAX_DEGREE_REDUCTION_PER_ROTATION
		rotateDelay = rotateDelay + INCREASE_IN_ROTATION_SPEED_PER_ROTATION
	}
}

async function rotatePaiting(
	paiting: HTMLElement,
	degrees: number,
	delay: number,
) {
	paiting.style.transform = `rotate3d(0, 0, 1, ${degrees}deg)`
	await sleep(delay)
}

function isPositiveDegree(degrees: number): boolean {
	return degrees > 0
}

function isLessThanMax(maxDegree: number, currentDegree: number): boolean {
	return currentDegree < maxDegree
}

function isBiggerThanNegativeMax(
	maxDegree: number,
	currentDegree: number,
): boolean {
	return currentDegree > maxDegree * -1
}

function isNotCentralized(currentDegree: number): boolean {
	return currentDegree !== 0
}
