import React, { useEffect, useState } from 'react'
import ArrowBack from '../../../../components/arrow_back'
import GameOverDialog from '../../../../components/dialogs/kids_space_dialog/game_over_dialog'
import { DinoRecord } from '../../../../components/record'
import DinoSwitch from '../../../../components/switch'
import PathConstants from '../../../../constants/app/PathConstants'
import { useLanguage } from '../../../../context/language'
import HistoryService from '../../../../services/history/HistoryService'
import GameRecordService from '../../../../storage/local_storage/GameRecordService'
import { GameRecordEnum } from '../../../../storage/local_storage/LS_Enum'
import SliderBoard from './components'
import './styles.css'

const DinoSlider: React.FC = () => {
	const language = useLanguage()

	const [openDialog, setOpenDialog] = useState(false)
	const [restart, setRestart] = useState(false)
	const [reduced, setReduced] = useState(false)
	const [record, setRecord] = useState(0)

	useEffect(() => {
		setRecord(GameRecordService.getRecord(GameRecordEnum.DINO_SLIDER))
	}, [])

	const handleClose = () => {
		setOpenDialog(false)
		HistoryService.push(PathConstants.GAME_MENU)
	}

	const handleRestart = () => {
		setOpenDialog(false)
		setRestart(true)
	}

	const handleGameOver = (score: number) => {
		setRestart(false)
		setOpenDialog(true)
		if (score > record) {
			setRecord(score)
			GameRecordService.setRecord(GameRecordEnum.DINO_SLIDER, score)
		}
	}

	return (
		<div className='minigame dino_slider'>
			<GameOverDialog
				onAgree={handleRestart}
				onDisagree={handleClose}
				open={openDialog}
			>
				<p>{language.data.SUCESS_GAME_OVER_LABEL}</p>
			</GameOverDialog>
			<div className='dino_slider__header'>
				<ArrowBack kids />
				<DinoRecord value={record}>
					<div className='dino_slider__switch'>
						<DinoSwitch
							selected={reduced}
							onChangeSelected={() => setReduced(!reduced)}
							label={language.data.REDUCE}
						/>
					</div>
				</DinoRecord>
			</div>
			<SliderBoard
				onGameOver={handleGameOver}
				restart={restart}
				reduced={reduced}
			/>
		</div>
	)
}

export default DinoSlider
