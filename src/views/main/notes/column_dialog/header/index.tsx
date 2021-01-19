import React from 'react'
import NoteColumnDialogHeaderProps from './props'
import './styles.css'
import { CardHeader } from '@material-ui/core'
import { useLanguage } from '../../../../../context/language'

const NoteColumnDialogHeader: React.FC<NoteColumnDialogHeaderProps> = ({
	editing,
}) => {
	const language = useLanguage()

	return (
		<CardHeader
			title={
				editing
					? language.data.COLUMN_EDIT_LABEL
					: language.data.COLUMN_ADD_LABEL
			}
			className='note__column_dialog__header'
		/>
	)
}

export default NoteColumnDialogHeader
