import React from 'react'
import { Dialog } from '@material-ui/core'
import TransitionSlide from '../../slide_transition'
import TextButton from '../../button/text_button'
import { DinoDialogContent } from '../../dino_dialog'
import GameOverDialogProps from './props'
import { useLanguage } from '../../../context/language/index'
import '../styles.css'
import './styles.css'

const GameOverDialog: React.FC<GameOverDialogProps> = ({
	open,
	children,
	onAgree,
	onDisagree,
}) => {
	const language = useLanguage()

	return (
		<Dialog TransitionComponent={TransitionSlide} open={open}>
			<DinoDialogContent>{children}</DinoDialogContent>
			<div className='game_over_dialog__buttons'>
				<TextButton onClick={onDisagree}>
					{language.data.DISAGREEMENT_OPTION_TEXT}
				</TextButton>
				<TextButton onClick={onAgree}>
					{language.data.AGREEMENT_OPTION_TEXT}
				</TextButton>
			</div>
		</Dialog>
	)
}

export default GameOverDialog
