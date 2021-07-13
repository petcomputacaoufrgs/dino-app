import React, { useState, useEffect } from 'react'
import PathConstants from '../../../../constants/app/PathConstants'
import HistoryService from '../../../../services/history/HistoryService'
import { useLanguage } from '../../../../context/language'
import GameOverDialog from '../../../../components/dialogs/kids_space_dialog/game_over_dialog'
import KidsSpaceGoBackButton from '../../../../components/button/go_back'
import {ReactComponent as Braquiosaurus} from '../../../../assets/new/dino+expressoes+acessorios/empty_dino.svg'
import {ReactComponent as Dinosaur} from '../../../../assets/new/friends/triceratops.svg'
import {ReactComponent as Diplodocus} from '../../../../assets/new/friends/trex.svg'
import {ReactComponent as Parasaurolophus} from '../../../../assets/new/friends/ptero.svg'
import {ReactComponent as Plateosaurus} from '../../../../assets/new/friends/ptero_color_variation.svg'
import {ReactComponent as Stegosaurus} from '../../../../assets/new/friends/triceratops_color_variation.svg'
import {ReactComponent as Triceratops} from '../../../../assets/new/friends/trex_color_variation.svg'
import {ReactComponent as Tyrannosaurus} from '../../../../assets/new/dino+expressoes+acessorios/empty_dino_color_variation.svg'
import MemoryBoard from './components/board'
import BoardPiece from './components/types/BoardPiece'
import './styles.css'

const MemoryGame: React.FC = () => {
	const language = useLanguage()
	const [openDialog, setOpenDialog] = useState(false)
	const [restart, setRestart] = useState(false)

	const board = [
		...getPieces(),
		...getPieces()
	]

	const boardRandom = board.sort(() => Math.random() - 0.5)

	useEffect(() => {
		if (restart) {
			setRestart(false)
		}
	}, [restart])

	const handleClose = () => {
		setOpenDialog(false)
		HistoryService.push(PathConstants.GAME_MENU)
	}

	const handleRestart = () => {
		setOpenDialog(false)
		setRestart(true)	
	}

	const handleGameOver = () => {
		setOpenDialog(true)
	}

	return (
		<div className='minigame memory_game'>
			<GameOverDialog
				onAgree={handleRestart}
				onDisagree={handleClose}
				open={openDialog}
			>
				<p>{language.data.MEMORY_GAME_GAME_OVER}</p>
			</GameOverDialog>
			<KidsSpaceGoBackButton />
			<MemoryBoard pieceList={boardRandom} onGameOver= {handleGameOver} restart={restart}/>
		</div>
	)
}

export default MemoryGame


const getPieces = (): BoardPiece[] => {

	const SVGs = [ Braquiosaurus, Dinosaur, Diplodocus, Parasaurolophus, Plateosaurus, Stegosaurus, Triceratops, Tyrannosaurus ]
  return SVGs.map(svg => { return { image: svg, turned: false, visible: true }})
}