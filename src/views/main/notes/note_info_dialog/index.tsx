import React, { useState, useEffect } from 'react'
import NoteInfoDialogProps from './props'
import { CardHeader, DialogTitle, TextField } from '@material-ui/core'
import DateUtils from '../../../../utils/DateUtils'
import NoteConstants from '../../../../constants/note/NoteConstants'
import Autocomplete from '@material-ui/lab/Autocomplete'
import DiscreetTextField from '../../../../components/discreet_text_field'
import { ReactComponent as DeleteOutlineIcon } from '../../../../assets/icons/delete.svg'
import DinoIconButton from '../../../../components/button/icon_button'
import AgreementDialog from '../../../../components/dialogs/agreement_dialog'
import { useLanguage } from '../../../../context/language'
import DinoDialog from '../../../../components/dialogs/dino_dialog'
import './styles.css'
import DataConstants from '../../../../constants/app_data/DataConstants'
import { DinoTextfield } from '../../../../components/textfield'
import CreateIcon from '@material-ui/icons/Create'
import OptionsIconButton from '../../../../components/button/icon_button/options_icon_button'
import ItemListMenu from '../../../../components/list_components/item_list_menu'

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

	const [questionWithError, setQuestionWithError] = useState(false)
	const [questionErrorHelper, setQuestionErrorHelper] = useState('')

	const [deleteNoteDialogOpen, setDeleteNoteDialogOpen] = useState(false)

	useEffect(() => {
		setAnswer(note.answer)
		setQuestion(note.question)
		setTagList(note.tags)
		setEditedQuestion(false)
	}, [note])

	const handleQuestionChange = (newQuestion: string) => {
		const validQuestion = newQuestion.substring(
			0,
			DataConstants.NOTE_QUESTION.MAX,
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
		const validAnswer = value.substring(0, DataConstants.NOTE_ANSWER.MAX)

		setAnswer(validAnswer)
	}

	const handleTagChange = (event: React.ChangeEvent<{}>, values: string[]) => {
		if (values.length <= NoteConstants.TAG_LIMIT) {
			setTagList(values)
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
				setQuestionErrorHelper(
					language.data.itemAlreadyExists(language.data.QUESTION),
				)
				return false
			}
		}

		if (questionWithError) {
			setQuestionWithError(false)
			setQuestionErrorHelper('')
		}

		return true
	}

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

	const handleOpenOptions = (event: React.MouseEvent<HTMLButtonElement>) =>
		setAnchorEl(event.currentTarget)

	return (
		<DinoDialog
			open={open}
			onClose={onClose}
			onSave={handleSaveNote}
			header={
				<div className='note_info_dialog__title'>
					<CardHeader
						avatar={<CreateIcon />}
						action={
							<div className='dino__flex_row'>
								<OptionsIconButton onClick={handleOpenOptions} />
							</div>
						}
						title={question}
						subheader={DateUtils.getDateStringFormated(
							note.lastUpdate!,
							language.data,
						)}
					/>
				</div>
			}
		>
			<div className='note__info_dialog__content'>
				<DinoTextfield
					label={`${language.data.ANSWER_NOTE_DIALOG_TITLE}`}
					maxLength={DataConstants.NOTE_ANSWER.MAX}
					multiline
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
						<DinoTextfield
							{...params}
							label={`${language.data.NOTE_TAG_LABEL}`}
							inputProps={{
								...params.inputProps,
								maxLength: DataConstants.NOTE_TAG.MAX,
							}}
							maxLength={DataConstants.NOTE_TAG.MAX}
						/>
					)}
				/>
				<AgreementDialog
					onAgree={handleDeleteNoteAgree}
					onDisagree={handleDeleteNoteDisagree}
					question={language.data.DELETE_NOTE_ALERT_TITLE}
					description={language.data.DELETE_NOTE_ALERT_TEXT}
					agreeOptionText={language.data.YES}
					disagreeOptionText={language.data.NO}
					open={deleteNoteDialogOpen}
				/>
			</div>
			<ItemListMenu
				anchor={anchorEl}
				setAnchor={setAnchorEl}
				onDelete={onDelete}
			/>
		</DinoDialog>
	)
}

export default NoteInfoDialog
