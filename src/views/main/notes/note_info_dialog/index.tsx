import React, { useState, useEffect } from 'react'
import NoteInfoDialogProps from './props'
import {
	DialogTitle,
	TextField,
} from '@material-ui/core'
import DateUtils from '../../../../utils/DateUtils'
import NoteConstants from '../../../../constants/note/NoteConstants'
import Autocomplete from '@material-ui/lab/Autocomplete'
import DiscreetTextField from '../../../../components/discreet_text_field'
import ArrayUtils from '../../../../utils/ArrayUtils'
import { ReactComponent as DeleteOutlineIcon } from '../../../../assets/icons/delete.svg'
import IconButton from '../../../../components/button/icon_button'
import AgreementDialog from '../../../../components/agreement_dialog'
import { useLanguage } from '../../../../context/language'
import './styles.css'
import DinoDialog from '../../../../components/dialogs/dino_dialog'

const NoteInfoDialog: React.FC<NoteInfoDialogProps> = ({
	note,
	open,
	tagOptions,
	onSave,
	onClose,
	onDelete,
	questionAlreadyExists,
}) => {
	const language = useLanguage()

	const [question, setQuestion] = useState(note.question)
	const [answer, setAnswer] = useState(note.answer)
	const [tagList, setTagList] = useState(note.tags)

	const [editedQuestion, setEditedQuestion] = useState(false)
	const [editedAnswer, setEditedAnswer] = useState(false)
	const [editedTagList, setEditedTagList] = useState(false)

	const [questionWithError, setQuestionWithError] = useState(false)
	const [questionErrorHelper, setQuestionErrorHelper] = useState('')

	const [deleteNoteDialogOpen, setDeleteNoteDialogOpen] = useState(false)

	useEffect(() => {
		setAnswer(note.answer)
		setQuestion(note.question)
		setTagList(note.tags)
		setEditedQuestion(false)
		setEditedAnswer(false)
		setEditedTagList(false)
	}, [note])

	const handleQuestionChange = (newQuestion: string) => {
		const validQuestion = newQuestion.substring(
			0,
			NoteConstants.QUESTION_MAX_LENGTH,
		)
		const questionChanged = note.question !== validQuestion.trim()

		setQuestion(validQuestion)
		setEditedQuestion(questionChanged)

		if (questionWithError) {
			setQuestionWithError(false)
			setQuestionErrorHelper('')
		}
	}

	const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value
		const validAnswer = value.substring(0, NoteConstants.ANSWER_MAX_LENGTH)
		const answerChanged = note.answer !== validAnswer.trim()

		setAnswer(validAnswer)
		setEditedAnswer(answerChanged)
	}

	const handleTagChange = (event: React.ChangeEvent<{}>, values: string[]) => {
		if (values.length <= NoteConstants.TAG_LIMIT) {
			const changed = ArrayUtils.notEqualIgnoreOrder(values, note.tags)
			setTagList(values)
			setEditedTagList(changed)
		}
	}

	const handleSaveNote = async () => {
		const newQuestion = question.trim()

		if (editedQuestion && !validateQuestion(newQuestion)) {
			return
		}

		onSave(question, answer, tagList)
	}

	const handleDeleteNoteAgree = () => {
		onDelete()

		setDeleteNoteDialogOpen(false)
	}

	const handleDeleteNoteDisagree = () => {
		setDeleteNoteDialogOpen(false)
	}

	const handleDeleteNote = () => {
		setDeleteNoteDialogOpen(true)
	}

	const isEdited = () => editedTagList || editedAnswer || editedQuestion

	const validateQuestion = async (newQuestion: string): Promise<boolean> => {
		if (!newQuestion) {
			setQuestionWithError(true)
			setQuestionErrorHelper(language.data.EMPTY_FIELD_ERROR)
			return false
		}

		if (newQuestion !== note.question) {
			const questionConflict = questionAlreadyExists(newQuestion)

			if (questionConflict) {
				setQuestionWithError(true)
				setQuestionErrorHelper(language.data.QUESTION_ALREADY_EXISTS_ERROR)
				return false
			}
		}

		if (questionWithError) {
			setQuestionWithError(false)
			setQuestionErrorHelper('')
		}

		return true
	}

	return (

		<DinoDialog 
			open={open} handleClose={onClose} handleSave={handleSaveNote}
			header={
				<DialogTitle disableTypography className='note_info_dialog__title'>
					<DiscreetTextField
						error={questionWithError}
						helperText={questionErrorHelper}
						text={question}
						onChange={handleQuestionChange}
						className='note__info_dialog__title__question'
					/>
					<IconButton
						className='note_info_dialog__delete_icon'
						icon={DeleteOutlineIcon}
						onClick={handleDeleteNote}
					/>
					<div className='note_info_dialog__last_update'>
						<h4>
							{DateUtils.getDateStringFormated(note.lastUpdate!, language.data)}
						</h4>
					</div>
				</DialogTitle>
			}
		>
			<div className='note__info_dialog__content'>
			<TextField
					label={`${language.data.ANSWER_NOTE_DIALOG_TITLE}`}
					type='text'
					multiline
					variant='standard'
					value={answer}
					onChange={handleAnswerChange}
					className='note__info_dialog__content__answer'
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
							variant='standard'
							inputProps={{
								...params.inputProps,
								maxLength: NoteConstants.TAG_MAX_LENGTH,
							}}
						/>
					)}
				/>
				<AgreementDialog
					onAgree={handleDeleteNoteAgree}
					onDisagree={handleDeleteNoteDisagree}
					question={language.data.DELETE_NOTE_ALERT_TITLE}
					description={language.data.DELETE_NOTE_ALERT_TEXT}
					agreeOptionText={language.data.AGREEMENT_OPTION_TEXT}
					disagreeOptionText={language.data.DISAGREEMENT_OPTION_TEXT}
					open={deleteNoteDialogOpen}
				/>
				</div>
		</DinoDialog>
		
	)
}

export default NoteInfoDialog
