import React, { useState, useEffect } from 'react'
import NoteCreateDialogProps from './props'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import NoteConstants from '../../../../constants/note/NoteConstants'
import { useLanguage } from '../../../../context/language'
import './styles.css'
import DinoDialog, { DinoDialogHeader } from '../../../../components/dialogs/dino_dialog'

const NoteCreateDialog: React.FC<NoteCreateDialogProps> = ({
	onClose,
	onSave,
	open,
	tagOptions,
	questionAlreadyExists,
}): JSX.Element => {
	const language = useLanguage()

	const [question, setQuestion] = useState('')
	const [questionWithError, setQuestionWithError] = useState(false)
	const [questionErrorHelper, setQuestionErrorHelper] = useState('')

	const [tagList, setTagList] = useState<string[]>([])

	const handleTagChange = (event: React.ChangeEvent<{}>, values: string[]) => {
		if (values.length <= NoteConstants.TAG_LIMIT) {
			setTagList(values)
		}
	}

	const handleSave = async () => {
		const newQuestion = question.trim()

		if (newQuestion.length === 0) {
			setQuestionWithError(true)
			setQuestionErrorHelper(language.data.EMPTY_FIELD_ERROR)

			return
		}

		const questionConflict = questionAlreadyExists(newQuestion)
		if (questionConflict) {
			setQuestionWithError(true)
			setQuestionErrorHelper(language.data.itemAlreadyExists(language.data.QUESTION))

			return
		}

		onSave(newQuestion, tagList)
	}

	const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value

		const newQuestion = value.substring(0, NoteConstants.QUESTION_MAX_LENGTH)

		if (questionWithError) {
			setQuestionWithError(false)
			setQuestionErrorHelper('')
		}

		setQuestion(newQuestion)
	}

	useEffect(() => {
		if (open) {
			setTagList([])
			setQuestion('')
			setQuestionWithError(false)
			setQuestionErrorHelper('')
		}
	}, [open])

	const renderDialogContent = (): JSX.Element => {
		return (
			<div className='note_create__dialog_content'>
				<TextField
					error={questionWithError}
					helperText={questionErrorHelper}
					label={
						language.data.QUESTION_NOTE_DIALOG_TITLE
					}
					type='text'
					multiline
					variant='outlined'
					value={question}
					onChange={handleQuestionChange}
				/>
				<Autocomplete
					multiple
					freeSolo
					value={tagList}
					limitTags={1}
					onChange={handleTagChange}
					options={tagOptions}
					renderInput={params => (
						<TextField
							{...params}
							fullWidth
							label={`${language.data.NOTE_TAG_LABEL}`}
							variant='outlined'
							inputProps={{
								...params.inputProps,
								maxLength: NoteConstants.TAG_MAX_LENGTH,
							}}
						/>
					)}
				/>
				</div>
		)
	}
	return (
		<DinoDialog
			open={open}
			onClose={onClose}
			onSave={handleSave}
			header={<DinoDialogHeader>{language.data.NOTE_EDIT_DIALOG_NEW_NOTE_TITLE}</DinoDialogHeader>}
		>
		 	{renderDialogContent()}
		</DinoDialog>
	)
}

export default NoteCreateDialog
