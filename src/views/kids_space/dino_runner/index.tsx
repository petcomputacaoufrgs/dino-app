import React, { useState, useRef, useEffect } from 'react'
import { startDinoRunnerGame } from './engine/game'
import { useLanguage } from '../../../context/language'
import HistoryService from '../../../services/history/HistoryService'
import PathConstants from '../../../constants/app/PathConstants'
import { ReactComponent as BackgroundSVG } from '../../../assets/kids_space/dino_runner/background.svg'
import GameOverDialog from '../../../components/kids_space_dialog/game_over_dialog'
import GoBackButton from '../../../components/button/go_back'
import './styles.css'

const DinoRunner: React.FC = () => {
	const language = useLanguage()

	const dinoRunnerGameContainer = useRef<HTMLDivElement>(null)
	const dinoRunnerGameGrid = useRef<HTMLDivElement>(null)
	const dinoRunnerGameCharacter = useRef<HTMLDivElement>(null)
	const dinoRunnerGameScoreBoard = useRef<HTMLDivElement>(null)

	const [openDialog, setOpenDialog] = useState(false)
	const [gameStarted, setGameStarted] = useState(false)
	const [startGame, setStartGame] = useState<() => void>(() => {})

	useEffect(() => {
		const container = dinoRunnerGameContainer.current
		const grid = dinoRunnerGameGrid.current
		const character = dinoRunnerGameCharacter.current
		const scoreBoard = dinoRunnerGameScoreBoard.current

		if (container && grid && character && scoreBoard) {
			const [handleStopBackgroundEngine, handleStartGame] = startDinoRunnerGame(
				handleGameEnd,
				container,
				grid,
				character,
				scoreBoard,
			)
			setStartGame(() => handleStartGame)
			return handleStopBackgroundEngine
		}
	}, [])

	function handleClose() {
		setOpenDialog(false)
		HistoryService.push(PathConstants.GAME_MENU)
	}

	function handleRestart() {
		setOpenDialog(false)
		handleStartGame()
	}

	function handleStartGame() {
		setGameStarted(true)
		startGame()
	}

	function handleGameEnd() {
		setOpenDialog(true)
		setGameStarted(false)
	}

	return (
		<div ref={dinoRunnerGameContainer} className='dino_runner_game'>
			<GameOverDialog
				onAgree={handleRestart}
				onDisagree={handleClose}
				open={openDialog}
			>
				<p>{language.data.DINO_RUNNER_GAME_OVER_MSG_1}</p>
				<p>{language.data.PLAY_AGAIN_MESSAGE}</p>
			</GameOverDialog>
			<GoBackButton path={PathConstants.KIDS_SPACE} />
			<div ref={dinoRunnerGameGrid} className='dino_runner_game__grid'>
				<div
					ref={dinoRunnerGameCharacter}
					className='dino_runner_game__grid__character'
				></div>
			</div>
			<div className='dino_runner_game__score_board_container'>
				<div
					ref={dinoRunnerGameScoreBoard}
					className='dino_runner_game__score_board'
				/>
			</div>
			<BackgroundSVG className='dino_runner_game__grid__background' />
			{!gameStarted && (
				<button
					className='dino_runner_game__start_game_button'
					onClick={handleStartGame}
				>
					{language.data.START_GAME_TEXT}
				</button>
			)}
		</div>
	)
}

export default DinoRunner
