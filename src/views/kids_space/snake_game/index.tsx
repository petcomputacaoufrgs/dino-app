import React from 'react'
import PathConstants from '../../../constants/app/PathConstants'
import HistoryService from '../../../services/history/HistoryService'

const SnakeGame: React.FC = () => {
	return (
		<>
			<div>Eu sou o jogo da cobra ra ra</div>
			<button
				onClick={() => {
					HistoryService.push(PathConstants.GAME_MENU)
				}}
			>
				{' '}
				Clica ae{' '}
			</button>
		</>
	)
}

export default SnakeGame
