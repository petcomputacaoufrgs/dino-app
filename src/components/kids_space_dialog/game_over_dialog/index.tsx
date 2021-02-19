import React from 'react'
import TextButton from '../../button/text_button'
import GameOverDialogProps from './props'
import { useLanguage } from '../../../context/language/index'
import '../styles.css'
import './styles.css'
import '../../../views/kids_space/variables.css'

const GameOverDialog: React.FC<GameOverDialogProps> = ({
	open,
	children,
	onAgree,
	onDisagree,
}) => {
	const language = useLanguage()

	return (
		<>
		{open &&
		<div className="kids_space_dialog game_over_dialog">
  			<div className='game_over_dialog__content'>
    			{children}
				<p>{language.data.PLAY_AGAIN_MESSAGE}</p>
  			</div>
			<div className='game_over_dialog__buttons'>
				<TextButton onClick={onDisagree}>
					{language.data.DISAGREEMENT_OPTION_TEXT}
				</TextButton>
				<TextButton onClick={onAgree}>
					{language.data.AGREEMENT_OPTION_TEXT}
				</TextButton>
			</div>
		</div>}
		</>
	)
}

export default GameOverDialog
