import React, { useEffect, useState } from 'react'
import PathConstants from '../../../../constants/app/PathConstants'
import HistoryService from '../../../../services/history/HistoryService'
import { starGame } from './engine'
import { useLanguage } from '../../../../context/language'
import GameOverDialog from '../../../../components/dialogs/kids_space_dialog/game_over_dialog'

import './styles.css'
import ArrowBack from '../../../../components/arrow_back'
import GameRecordService from '../../../../storage/local_storage/GameRecordService'
import { GameRecordEnum } from '../../../../storage/local_storage/LS_Enum'
import { DinoRecord } from '../../../../components/record'

const SnakeGame: React.FC = () => {
	const language = useLanguage()
	const [openDialog, setOpenDialog] = useState(false)
	const [record, setRecord] = useState(0)

	useEffect(() => {
		setRecord(GameRecordService.getRecord(GameRecordEnum.DINO_SNAKE))
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

	const handleGameOver = (score?: number) => {
		setOpenDialog(true)
		if (score && score > record) {
			setRecord(score)
			GameRecordService.setRecord(GameRecordEnum.DINO_SNAKE, score)
		}
	}

	return (
		<div className='snake_container'>
			<GameOverDialog
				onAgree={handleRestart}
				onDisagree={handleClose}
				open={openDialog}
			>
				<p>{language.data.SNAKE_GAME_GAME_OVER_MSG_1}</p>
			</GameOverDialog>
			<div className='snake_game'>
				<ArrowBack kids />
				<DinoRecord value={record} />
				<div id='snake_game__score_board' />
				<div id='snake_game__game_board' />
			</div>
		</div>
	)
}

export default SnakeGame
