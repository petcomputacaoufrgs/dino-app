import React from 'react'
import PathConstants from '../../../constants/app/PathConstants'
import HistoryService from '../../../services/history/HistoryService'
import GameCard from '../../../components/game_card'
import GoBackButton from '../../../components/button/go_back'
import './styles.css'

const GameMenu: React.FC = () => {
	return (
		<div className='game_menu'>
			<GoBackButton
				className='game_menu__go_back'
				path={PathConstants.KIDS_SPACE}
			/>
			<GameCard
				onClick={() => HistoryService.push(PathConstants.MEMORY_GAME)}
				text='Jogo da Memória'
				backgroundColor={'#FFA19C'}
			></GameCard>
			<GameCard
				onClick={() => console.log('1010')}
				text='1010'
				backgroundColor={'#FFD28C'}
			></GameCard>
			<GameCard
				onClick={() => {
					HistoryService.push(PathConstants.SNAKE_GAME)
				}}
				text='Jogo da Cobra'
				backgroundColor={'#C0FFB6'}
			></GameCard>
			<GameCard
				onClick={() => {
					HistoryService.push(PathConstants.MUSICAL_DINO_GAME)
				}}
				text='Dino musical'
				backgroundColor={'#B0FCFF'}
			></GameCard>
			<GameCard
				onClick={() => {
					HistoryService.push(PathConstants.TIC_TAC_DINO_GAME)
				}}
				text='Tic Tac Dino'
				backgroundColor={'#E1BFFF'}
			></GameCard>
			<GameCard
				onClick={() => {
					HistoryService.push(PathConstants.DINO_RUNNER_GAME)
				}}
				text='Dino Corredor'
				backgroundColor={'#FECBDC'}
			></GameCard>
		</div>
	)
}

export default GameMenu
