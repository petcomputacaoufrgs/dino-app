import React from 'react'
import PathConstants from '../../../constants/app/PathConstants'
import HistoryService from '../../../services/history/HistoryService'
import GameCard from '../../../components/game_card'
import KidsSpaceGoBackButton from '../../../components/button/go_back'
import './styles.css'
import { useLanguage } from '../../../context/language'


const GameMenu: React.FC = () => {
	
	const language = useLanguage() 
	
	return (
		<div className='game_menu'>
			<KidsSpaceGoBackButton
				className='game_menu__go_back__button'
				path={PathConstants.KIDS_SPACE}
			/>
			<GameCard
				onClick={() => HistoryService.push(PathConstants.DINO_RUNNER_GAME)}
				text={language.data.DINO_RUNNER_GAME}
				backgroundColor={'#FFA19C'}
			/>
			<GameCard
				onClick={() => HistoryService.push(PathConstants.MEMORY_GAME)}
				text={language.data.MEMORY_GAME}
				backgroundColor={'#FFD28C'}
			/>
			<GameCard
				onClick={() => HistoryService.push(PathConstants.DINO_SLIDER_GAME)}
				text={language.data.DINO_SLIDER_GAME}
				backgroundColor={'#FFFB8C'}
			/>
			<GameCard
				onClick={() => HistoryService.push(PathConstants.SNAKE_GAME)}
				text={language.data.SNAKE_GAME}
				backgroundColor={'#C0FFB6'}
			/>
			<GameCard
				onClick={() => HistoryService.push(PathConstants.MUSICAL_DINO_GAME)}
				text={language.data.MUSICAL_DINO_GAME}
				backgroundColor={'#B0FCFF'}
			/>
			<GameCard
				onClick={() => HistoryService.push(PathConstants.TIC_TAC_DINO_GAME)}
				text={language.data.TIC_TAC_DINO_GAME}
				backgroundColor={'#E1BFFF'}
			/>
		</div>
	)
}

export default GameMenu
