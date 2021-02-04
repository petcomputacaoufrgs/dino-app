import React from 'react'
import { ReactComponent as DinoAuthSVG } from '../../assets/icons/dino/dino_auth.svg'
import './styles.css'

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

export default DinoDialogHeader
