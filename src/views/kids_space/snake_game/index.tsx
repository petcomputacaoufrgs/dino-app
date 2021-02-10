import React, { useEffect, useState } from 'react'
import PathConstants from '../../../constants/app/PathConstants'
import HistoryService from '../../../services/history/HistoryService'
import { starGame } from './engine'
import { useLanguage } from '../../../context/language'
import GameOverDialog from '../../../components/game_over_dialog'
import GoBackButton from '../../../components/button/go_back'
import './styles.css'

const SnakeGame: React.FC = () => {
	const language = useLanguage()
	const [openDialog, setOpenDialog] = useState(false)

	useEffect(() => {
		starGame(handleGameOver)
	}, [])

	const handleClose = () => {
		setOpenDialog(false)
		HistoryService.push(PathConstants.GAME_MENU)
	}

	const handleRestart = () => {
		setOpenDialog(false)
		starGame(handleGameOver)
	}

	const handleGameOver = () => {
		setOpenDialog(true)
	}

	return (
		<div className='minigame snake_game'>
			<GameOverDialog
				onAgree={handleRestart}
				onDisagree={handleClose}
				open={openDialog}
			>
				<p>{language.data.SNAKE_GAME_GAME_OVER_MSG_1}</p>
			</GameOverDialog>
			<GoBackButton path={PathConstants.GAME_MENU} />
			<div id='snake_game__score_board'></div>
			<div id='snake_game__game_board'></div>
		</div>
	)
}

export default SnakeGame
