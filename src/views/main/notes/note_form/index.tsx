import React, { useState, useEffect } from 'react'
import NoteFormProps from './props'
import { CardHeader } from '@material-ui/core'
import DateUtils from '../../../../utils/DateUtils'
import NoteConstants from '../../../../constants/note/NoteConstants'
import Autocomplete from '@material-ui/lab/Autocomplete'
import AgreementDialog from '../../../../components/dialogs/agreement_dialog'
import { useLanguage } from '../../../../context/language'
import DinoDialog from '../../../../components/dialogs/dino_dialog'
import './styles.css'
import DataConstants from '../../../../constants/app_data/DataConstants'
import { DinoTextfield } from '../../../../components/textfield'
import CreateIcon from '@material-ui/icons/Create'
import OptionsIconButton from '../../../../components/button/icon_button/options_icon_button'
import ItemListMenu from '../../../../components/list_components/item_list_menu'
import StringUtils from '../../../../utils/StringUtils'

const NoteForm: React.FC<NoteFormProps> = ({
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
	const [errorQuestionMessage, setErrorQuestionMessage] = useState<string>()
	const [deleteNoteDialogOpen, setDeleteNoteDialogOpen] = useState(false)

	useEffect(() => {
		setAnswer(note.answer)
		setQuestion(note.question)
		setTagList(note.tags)
	}, [note])

	const handleTagChange = (event: React.ChangeEvent<{}>, values: string[]) => {
		if (values.length <= NoteConstants.TAG_LIMIT) {
			setTagList(values)
		}
	}

	const handleSaveNote = async () => {
		if (isValidData()) {
			onSave(question, answer, tagList)
		}
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

	const isValidData = () => {
		if (StringUtils.isEmpty(question)) {
			setErrorQuestionMessage(language.data.EMPTY_FIELD_ERROR)
			return false
		}

		const questionConflict = questionAlreadyExists(question)

		if (questionConflict) {
			setErrorQuestionMessage(
				language.data.itemAlreadyExists(language.data.QUESTION),
			)
			return false
		}

		setErrorQuestionMessage(undefined)
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
					className='note__info_dialog__content__question'
					label={`${language.data.QUESTION_NOTE_DIALOG_TITLE}`}
					dataProps={DataConstants.NOTE_QUESTION}
					multiline
					value={question}
					onChange={e => setQuestion(e.target.value)}
					errorMessage={errorQuestionMessage}
				/>
				<DinoTextfield
					className='note__info_dialog__content__answer'
					label={`${language.data.ANSWER_NOTE_DIALOG_TITLE}`}
					dataProps={DataConstants.NOTE_ANSWER}
					multiline
					value={answer}
					onChange={e => setAnswer(e.target.value)}
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
							dataProps={DataConstants.NOTE_TAG}
						/>
					)}
				/>
				<AgreementDialog
					onAgree={handleDeleteNoteAgree}
					onDisagree={handleDeleteNoteDisagree}
					question={language.data.DELETE_NOTE_ALERT_TITLE}
					open={deleteNoteDialogOpen}
				/>
			</div>
			<ItemListMenu
				anchor={anchorEl}
				setAnchor={setAnchorEl}
				onDelete={handleDeleteNote}
			/>
		</DinoDialog>
	)
}

export default NoteForm
