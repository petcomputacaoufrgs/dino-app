import React, { useState } from 'react'
import { useLanguage } from '../../../../context/language'
import HistoryService from '../../../../services/history/HistoryService'
import PathConstants from '../../../../constants/app/PathConstants'
import GameOverDialog from '../../../../components/dialogs/kids_space_dialog/game_over_dialog'
import Game from './components/Game'
import ArrowBack from '../../../../components/arrow_back'
import DinoSwitch from '../../../../components/switch'
import '../../variables.css'
import './styles.css'

const TicTacDino: React.FC = () => {
	const language = useLanguage()
	const [openDialog, setOpenDialog] = useState(false)
	const [gameStarted, setGameStarted] = useState(true)
	const [message, setMessage] = useState('')
	const [isAiOn, setAiOn] = useState(true)

	function handleClose() {
		setOpenDialog(false)
		HistoryService.push(PathConstants.GAME_MENU)
	}

	function handleRestart() {
		setOpenDialog(false)
		setGameStarted(true)
	}

	function handleEndGame(winner: string | null) {
		setGameStarted(false)
		setMessage(
			winner
				? `${language.data.TIC_TAC_DINO_GAME_OVER_MSG_1} ${winner}!`
				: language.data.TIE,
		)
		setOpenDialog(true)
	}

	return (
		<div className='tic_tac_container'>
			<GameOverDialog
				onAgree={handleRestart}
				onDisagree={handleClose}
				open={openDialog}
			>
				<p>{message}</p>
			</GameOverDialog>
			<div className='tic_tac_dino_game'>
				<ArrowBack kids />
				<DinoSwitch
					selected={isAiOn}
					onChangeSelected={() => setAiOn(!isAiOn)}
					label={language.data.TIC_TAC_DINO_GAME_IS_AI_ON}
				/>
				<Game
					isAiOn={isAiOn}
					onEndGame={handleEndGame}
					gameStarted={gameStarted}
				/>
			</div>
		</div>
	)
}
export default TicTacDino
