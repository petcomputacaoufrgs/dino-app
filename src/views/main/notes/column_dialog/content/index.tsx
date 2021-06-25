import React from 'react'
import NoteColumnDialogContentProps from './props'
import { TextField } from '@material-ui/core'
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
		<div className='note__column_dialog__content'>
			<TextField
				required
				fullWidth
				value={title}
				onChange={handleTitleChange}
				error={invalidTitle}
				helperText={invalidMessage}
				autoFocus
				margin='dense'
				label={`${language.data.COLUMN_TITLE_LABEL}`}
				type='name'
				ref={inputRef}
			/>
		</div>
	)
}

export default NoteColumnDialogContent
