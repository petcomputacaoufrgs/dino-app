const TOTAL_TURNS = 20

let order: number[] = []
let playerOrder: number[] = []
let flash: number
let turn: number
let good: boolean
let compTurn: boolean
let intervalId: NodeJS.Timeout | null
let win: boolean
let blocked: boolean

let topLeft: HTMLElement | null
let topRight: HTMLElement | null
let bottomLeft: HTMLElement | null
let bottomRight: HTMLElement | null
let startButton: HTMLElement | null
let turnDiv: HTMLElement | null

let onWin: () => void

export function startGame(handleWin: () => void) {
	onWin = handleWin
	topLeft = document.getElementById('musical_dino__topleft')
	topRight = document.getElementById('musical_dino__topright')
	bottomLeft = document.getElementById('musical_dino__bottomleft')
	bottomRight = document.getElementById('musical_dino__bottomright')
	startButton = document.getElementById('musical_dino__start')
	turnDiv = document.getElementById('musical_dino__header__turn')

	win = true
	
	compTurn = false
	blocked = false

	topLeft!.onclick = () => {
		if (!compTurn && !blocked) {
			playerOrder.push(1)
			blocked = true
			check()
			one()
			if (!win) {
				setTimeout(() => {
					clearColor()
					blocked = false
				}, 300)
			}
		}
	}

	topRight!.onclick = () => {
		if (!compTurn && !blocked) {
			playerOrder.push(2)
			blocked = true
			check()
			two()
			if (!win) {
				setTimeout(() => {
					clearColor()
					blocked = false
				}, 300)
			}
		}
	}

	bottomLeft!.onclick = () => {
		if (!compTurn && !blocked) {
			playerOrder.push(3)
			blocked = true
			check()
			three()
			if (!win) {
				setTimeout(() => {
					clearColor()
					blocked = false
				}, 300)
			}
		}
	}

	bottomRight!.onclick = () => {
		if (!compTurn && !blocked) {
			playerOrder.push(4)
			blocked = true
			check()
			four()
			if (!win) {
				setTimeout(() => {
					clearColor()
					blocked = false
				}, 300)
			}
		}
	}

	if (win) {
		startButton!.style.display = 'none'
		playGame()
	}
}

function playGame() {
	win = false
	order = []
	playerOrder = []
	flash = 0
	intervalId = null
	turn = 1
	good = true
	turnDiv!.innerHTML = turn.toString()

	for (let i = 0; i < TOTAL_TURNS; i++) {
		order.push(Math.floor(Math.random() * 4) + 1)
	}
	compTurn = true

	intervalId = setInterval(gameTurn, 800)
}

function gameTurn() {
	if (flash === turn) {
		clearInterval(intervalId!)
		compTurn = false
		clearColor()
	}

	if (compTurn) {
		clearColor()
		setTimeout(() => {
			if (order[flash] === 1) one()
			if (order[flash] === 2) two()
			if (order[flash] === 3) three()
			if (order[flash] === 4) four()
			flash++
		}, 200)
	}
}

function one() {
	const audio = document.getElementById(
		'musical_dino__clip1',
	) as HTMLAudioElement | null
	if (audio) {
		audio.play()
	}
	
	topLeft!.classList.add('musical_dino__dino_moving')
}

function two() {
	const audio = document.getElementById(
		'musical_dino__clip2',
	) as HTMLAudioElement | null
	if (audio) {
		audio.play()
	}	

	topRight!.classList.add('musical_dino__dino_moving')
}

function three() {
	const audio = document.getElementById(
		'musical_dino__clip3',
	) as HTMLAudioElement | null
	if (audio) {
		audio.play()
	}

	bottomLeft!.classList.add('musical_dino__dino_moving')
}

function four() {
	const audio = document.getElementById(
		'musical_dino__clip4',
	) as HTMLAudioElement | null
	if (audio) {
		audio.play()
	}

	bottomRight!.classList.add('musical_dino__dino_moving')
}

function clearColor() {
	topLeft!.classList.remove('musical_dino__dino_moving')
	topRight!.classList.remove('musical_dino__dino_moving')
	bottomLeft!.classList.remove('musical_dino__dino_moving')
	bottomRight!.classList.remove('musical_dino__dino_moving')
}

function flashColor() {
	topLeft!.classList.add('musical_dino__dino_moving')
	topRight!.classList.add('musical_dino__dino_moving')
	bottomLeft!.classList.add('musical_dino__dino_moving')
	bottomRight!.classList.add('musical_dino__dino_moving')
}

function check() {
	if (playerOrder[playerOrder.length - 1] !== order[playerOrder.length - 1]) {
		good = false
	}

	if (playerOrder.length === TOTAL_TURNS && good) {
		winGame()
	}

	// error
	if (good === false) {
		flashColor()
		flash = 0
		playerOrder = []
		good = true
		compTurn = true
		console.log('setado pra true')
		setTimeout(() => {
			clearColor()
			intervalId = setInterval(gameTurn, 800)
		}, 800)
	}

	// all good
	if (turn === playerOrder.length && good && !win) {
		turn++
		turnDiv!.innerHTML = turn.toString()
		playerOrder = []
		flash = 0
		compTurn = true
		console.log('setado pra true')
		intervalId = setInterval(gameTurn, 800)
	}
}

function winGame() {
	flashColor()
	win = true
	onWin()
}
