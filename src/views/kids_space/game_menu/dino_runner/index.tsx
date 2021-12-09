import React, { useState, useRef, useEffect } from 'react'
import { startDinoRunnerGame } from './engine/game'
import { useLanguage } from '../../../../context/language'
import { ReactComponent as BackgroundSVG } from '../../../../assets/kids_space/games/dino_runner/background.svg'
import ArrowBack from '../../../../components/arrow_back'
import './styles.css'
import GameRecordService from '../../../../storage/local_storage/GameRecordService'
import { GameRecordEnum } from '../../../../storage/local_storage/LS_Enum'
import { DinoRecord } from '../../../../components/record'

const DinoRunner: React.FC = () => {
	const language = useLanguage()

	const dinoRunnerGameContainer = useRef<HTMLDivElement>(null)
	const dinoRunnerGameGrid = useRef<HTMLDivElement>(null)
	const dinoRunnerGameCharacter = useRef<HTMLDivElement>(null)
	const dinoRunnerGameScoreBoard = useRef<HTMLDivElement>(null)

	const [gameStarted, setGameStarted] = useState(false)
	const [startGame, setStartGame] = useState<() => void>(() => {})
	const [record, setRecord] = useState(0)

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
			setRecord(GameRecordService.getRecord(GameRecordEnum.DINO_RUNNER))
			return handleStopBackgroundEngine
		}
	}, [])

	function handleStartGame() {
		setGameStarted(true)
		startGame()
	}

	function handleGameEnd(score: number) {
		setGameStarted(false)
		if (score > record) {
			setRecord(score)
			GameRecordService.setRecord(GameRecordEnum.DINO_RUNNER, score)
		}
	}

	return (
		<div ref={dinoRunnerGameContainer} className='minigame dino_runner_game'>
			<ArrowBack kids />
			<DinoRecord value={record} />
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
					{language.data.START_GAME}
				</button>
			)}
		</div>
	)
}

export default DinoRunner
