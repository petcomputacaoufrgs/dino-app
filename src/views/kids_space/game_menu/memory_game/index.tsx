import React, { useState } from 'react'
import PathConstants from '../../../../constants/app/PathConstants'
import HistoryService from '../../../../services/history/HistoryService'
import { useLanguage } from '../../../../context/language'
import GameOverDialog from '../../../../components/kids_space_dialog/game_over_dialog'
import GoBackButton from '../../../../components/button/go_back'
import {ReactComponent as Braquiosaurus} from '../../../../assets/kids_space/memory_game/braquissaurus.svg'
import {ReactComponent as Dinosaur} from '../../../../assets/kids_space/memory_game/dinosaur.svg'
import {ReactComponent as Diplodocus} from '../../../../assets/kids_space/memory_game/diplodocus.svg'
import {ReactComponent as Parasaurolophus} from '../../../../assets/kids_space/memory_game/parasaurolophus.svg'
import {ReactComponent as Plateosaurus} from '../../../../assets/kids_space/memory_game/plateosaurus.svg'
import {ReactComponent as Stegosaurus} from '../../../../assets/kids_space/memory_game/stegosaurus.svg'
import {ReactComponent as Triceratops} from '../../../../assets/kids_space/memory_game/triceratops.svg'
import {ReactComponent as Tyrannosaurus} from '../../../../assets/kids_space/memory_game/tyrannosaurus-rex.svg'
import Board from './components/board'
import BoardPiece from './components/types/BoardPiece'
import './styles.css'

const MemoryGame: React.FC = () => {
	const language = useLanguage()
	const [openDialog, setOpenDialog] = useState(false)

	const board = [
		...getPieces(),
		...getPieces()
	]

	const boardRandom = board.sort(() => Math.random() - 0.5)

	const handleClose = () => {
		setOpenDialog(false)
		HistoryService.push(PathConstants.GAME_MENU)
	}

	const handleRestart = () => {
		setOpenDialog(false)
		
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
				<p>Cabou</p>
			</GameOverDialog>
			<GoBackButton path={PathConstants.GAME_MENU} />
			<Board pieceList={boardRandom} />
		</div>
	)
}

export default MemoryGame


const getPieces = (): BoardPiece[] => {
  return [
    {
      image: Braquiosaurus,
      turned: false,
	  visible: true
    },
    {
      image: Dinosaur,
      turned: false,
	  visible: true
    },
    {
      image: Diplodocus,
      turned: false,
	  visible: true
    },
    {
      image: Parasaurolophus,
      turned: false,
	  visible: true
    },
    {
      image: Plateosaurus,
      turned: false,
	  visible: true
    },
    {
      image: Stegosaurus,
      turned: false,
	  visible: true
    },
    {
      image: Triceratops,
      turned: false,
	  visible: true
    },
    {
      image: Tyrannosaurus,
      turned: false,
	  visible: true
    }
  ]
}