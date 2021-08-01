import React from 'react'
import { ReactComponent as DinoAuthSVG } from '../../../assets/icons/dino/dino_auth.svg'
import { Dialog, DialogContent, DialogActions } from '@material-ui/core'
import { useLanguage } from '../../../context/language'
import TextButton from '../../button/text_button'
import TransitionSlide from '../../slide_transition'
import DinoDialogProps from './props'
import '../styles.css'

const DinoDialog: React.FC<DinoDialogProps> = ({
	open,
	className,
	onClose,
	onSave,
	header,
	actions,
	children,
}) => {
	const language = useLanguage()

	const getClassName = () => {
		const native = 'dino_dialog dino__text__wrap'
		if (className) {
			return `${className} ${native}`
		}
		return native
	}

	return (
		<div>
			<Dialog
				className={getClassName()}
				open={open}
				onClose={onClose}
				TransitionComponent={TransitionSlide}
				fullWidth
				disableBackdropClick
				disableEscapeKeyDown
			>
				{header}
				<DialogContent dividers>{children}</DialogContent>
				{actions ? (
					<div className='dino_dialog__actions'>{actions}</div>
				) : (
					<DialogActions>
						<TextButton onClick={onClose}>{language.data.CANCEL}</TextButton>
						<TextButton onClick={onSave}>{language.data.SAVE}</TextButton>
					</DialogActions>
				)}
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
