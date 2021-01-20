import React from 'react'
import NoteColumnDialogContentProps from './props'
import { TextField } from '@material-ui/core'
import NoteColumnConstants from '../../../../../constants/note/NoteColumnConstants'
import { useLanguage } from '../../../../../context/language'

const NoteColumnDialogContent: React.FC<NoteColumnDialogContentProps> = ({
	onTitleChange,
	title,
	invalidTitle,
	invalidMessage,
	inputRef,
}) => {
	const language = useLanguage()

	const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onTitleChange(event.target.value as string)
	}

	return (
		<TextField
			required
			fullWidth
			value={title}
			onChange={handleTitleChange}
			error={invalidTitle}
			helperText={invalidMessage}
			autoFocus
			margin='dense'
			label={`${language.data.COLUMN_TITLE_LABEL} (${language.data.MAX} ${NoteColumnConstants.TITLE_MAX})`}
			type='name'
			ref={inputRef}
		/>
	)
}

export default NoteColumnDialogContent
