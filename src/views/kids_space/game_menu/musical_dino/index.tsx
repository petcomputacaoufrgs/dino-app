import React, { useEffect, useState } from 'react'
import PathConstants from '../../../../constants/app/PathConstants'
import HistoryService from '../../../../services/history/HistoryService'
import { startGame } from './engine/index'
import { ReactComponent as DinoSVG } from '../../../../assets/kids_space/dinos/felizp.svg'
import { useLanguage } from '../../../../context/language'
import GameOverDialog from '../../../../components/dialogs/kids_space_dialog/game_over_dialog'
import './styles.css'
import ArrowBack from '../../../../components/arrow_back'
import { DinoRecord } from '../../../../components/record'
import GameRecordService from '../../../../storage/local_storage/GameRecordService'
import { GameRecordEnum } from '../../../../storage/local_storage/LS_Enum'

const FluteSound = require('../../../../assets/kids_space/games/musical_dino/flute.mp3')
const MarimbaSound = require('../../../../assets/kids_space/games/musical_dino/marimba.mp3')
const PianoSound = require('../../../../assets/kids_space/games/musical_dino/piano.mp3')
const StringSound = require('../../../../assets/kids_space/games/musical_dino/string.mp3')

const MusicalDino: React.FC = () => {
	const language = useLanguage()
	const [openDialog, setOpenDialog] = useState(false)
	const [record, setRecord] = useState(0)

	useEffect(() => {
		setRecord(GameRecordService.getRecord(GameRecordEnum.DINO_MUSICAL))
	}, [])

	function handleWin() {
		setOpenDialog(true)
	}

	function handleClose() {
		setOpenDialog(false)
		HistoryService.push(PathConstants.GAME_MENU)
	}

	function handleRestart() {
		setOpenDialog(false)
		startGame(handleWin, handleWrongPlay)
	}

	function handleWrongPlay(score: number) {
		if (score > record) {
			setRecord(score)
			GameRecordService.setRecord(GameRecordEnum.DINO_MUSICAL, score)
		}
	}

	return (
		<div className='musical_dino'>
			<audio id='musical_dino__clip1'>
				<source src={FluteSound.default}></source>
			</audio>
			<audio id='musical_dino__clip2'>
				<source src={MarimbaSound.default}></source>
			</audio>
			<audio id='musical_dino__clip3'>
				<source src={PianoSound.default}></source>
			</audio>
			<audio id='musical_dino__clip4'>
				<source src={StringSound.default}></source>
			</audio>
			<GameOverDialog
				onAgree={handleRestart}
				onDisagree={handleClose}
				open={openDialog}
			>
				<p>{language.data.MUSICAL_DINO_GAME_MSG_1}</p>
				<p>{language.data.PLAY_AGAIN_MESSAGE}</p>
			</GameOverDialog>
			<div className='musical_dino__header'>
				<ArrowBack kids />
				<div id='musical_dino__header__turn'>0</div>
				<DinoRecord value={record} />
			</div>
			<div className='musical_dino__dino_song_board'>
				<div className='musical_dino__dino_song_board__top'>
					<div
						id='musical_dino__topleft'
						className='musical_dino__dino musical_dino__dino_light_pink'
					>
						<DinoSVG />
					</div>
					<div
						id='musical_dino__topright'
						className='musical_dino__dino musical_dino__dino_orange'
					>
						<DinoSVG />
					</div>
				</div>
				<div className='musical_dino__dino_song_board__bottom'>
					<div
						id='musical_dino__bottomleft'
						className='musical_dino__dino musical_dino__dino_red'
					>
						<DinoSVG />
					</div>
					<div
						id='musical_dino__bottomright'
						className='musical_dino__dino musical_dino__dino_dark_pink'
					>
						<DinoSVG />
					</div>
				</div>
			</div>
			<div className='musical_dino__start_game'>
				<button
					className='musical_dino__start_game__button'
					id='musical_dino__start'
					onClick={() => startGame(handleWin, handleWrongPlay)}
				>
					{language.data.START_GAME}
				</button>
			</div>
		</div>
	)
}

export default MusicalDino
