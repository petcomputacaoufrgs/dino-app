import React from 'react'
import { ReactComponent as DinoAuthSVG } from '../../../assets/icons/dino_auth.svg'
import { Dialog, DialogContent, DialogActions } from '@material-ui/core'
import { useLanguage } from '../../../context/language'
import TextButton from '../../button/text_button'
import TransitionSlide from '../../slide_transition'
import DinoDialogProps from './props'
import './styles.css'

const DinoDialog: React.FC<DinoDialogProps> = ({ open, handleClose, handleSave, header, actions, children }) => {

	const language = useLanguage()

	return (
		<div>
			<Dialog
				className='dino_dialog'
				open={open}
				maxWidth='xs'
				onClose={handleClose}
				TransitionComponent={TransitionSlide}
				fullWidth
				disableBackdropClick
				disableEscapeKeyDown
			>
				{ header }
				<DialogContent dividers>
					{children}
				</DialogContent>
				{ actions ?  <div className='dino_dialog__actions'>{actions}</div> : 
					<DialogActions>
						<TextButton onClick={handleClose}>
							{language.data.DIALOG_CANCEL_BUTTON_TEXT}
						</TextButton>
						<TextButton onClick={handleSave}>
							{language.data.DIALOG_SAVE_BUTTON_TEXT}
						</TextButton>
					</DialogActions>
				}
			</Dialog>
		</div>
	)
}

export default DinoDialog

export const DinoDialogHeader: React.FC = ({ children }) => {
	return (
		<div className='dino_dialog__header'>
			<div className='dino_dialog__header__title'>{children}</div>
			<DinoAuthSVG />
		</div>
	)
}

export const DinoDialogContent: React.FC = ({ children }) => {
	return <div className='dino_dialog__content'>{children}</div>
}