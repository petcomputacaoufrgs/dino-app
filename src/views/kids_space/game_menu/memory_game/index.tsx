import React, { useState, useEffect } from 'react'
import PathConstants from '../../../../constants/app/PathConstants'
import HistoryService from '../../../../services/history/HistoryService'
import { useLanguage } from '../../../../context/language'
import GameOverDialog from '../../../../components/dialogs/kids_space_dialog/game_over_dialog'
import { ReactComponent as Braquiosaurus } from '../../../../assets/kids_space/dinos/empty_dino_triangle.svg'
import { ReactComponent as Dinosaur } from '../../../../assets/kids_space/friends/triceratops_ray.svg'
import { ReactComponent as Diplodocus } from '../../../../assets/kids_space/friends/trex.svg'
import { ReactComponent as Parasaurolophus } from '../../../../assets/kids_space/friends/ptero.svg'
import { ReactComponent as Plateosaurus } from '../../../../assets/kids_space/friends/ptero_color_variation.svg'
import { ReactComponent as Stegosaurus } from '../../../../assets/kids_space/friends/triceratops_color_variation.svg'
import { ReactComponent as Triceratops } from '../../../../assets/kids_space/friends/trex_color_variation.svg'
import { ReactComponent as Tyrannosaurus } from '../../../../assets/kids_space/dinos/empty_dino_color_variation_circle.svg'
import MemoryBoard from './components/board'
import BoardPiece from './components/types/BoardPiece'
import ArrowBack from '../../../../components/arrow_back'
import './styles.css'

const MemoryGame: React.FC = () => {
	const [restart, setRestart] = useState(false)

	const board = [...getPieces(), ...getPieces()]

	const boardRandom = board.sort(() => Math.random() - 0.5)

	useEffect(() => {
		if (restart) setRestart(false)
	}, [restart])

	const handleRestart = () => {
		setRestart(true)
	}

	return (
		<div className='minigame memory_game'>
			<ArrowBack kids />
			<MemoryBoard
				pieceList={boardRandom}
				onGameOver={handleRestart}
				restart={restart}
			/>
		</div>
	)
}

export default MemoryGame

const getPieces = (): BoardPiece[] => {
	const SVGs = [
		Braquiosaurus,
		Dinosaur,
		Diplodocus,
		Parasaurolophus,
		Plateosaurus,
		Stegosaurus,
		Triceratops,
		Tyrannosaurus,
	]
	return SVGs.map(svg => {
		return { image: svg, turned: false, visible: true }
	})
}
