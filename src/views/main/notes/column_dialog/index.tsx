import React, { forwardRef, useState, useEffect, useRef } from 'react'
import './styles.css'
import NoteColumnDialogProps from './props'
import NoteColumnDialogContent from './content'
import NoteColumnConstants from '../../../../constants/note/NoteColumnConstants'
import NoteColumnEntity from '../../../../types/note/database/NoteColumnEntity'
import { useLanguage } from '../../../../context/language'
import DinoDialog, { DinoDialogHeader } from '../../../../components/dialogs/dino_dialog'

const NoteColumnDialog = forwardRef(
	(props: NoteColumnDialogProps, ref: React.Ref<JSX.Element>): JSX.Element => {
		const language = useLanguage()

		const inputRef = useRef<HTMLInputElement>(null)

		const [newTitle, setNewTitle] = useState<string>(
			props.column ? props.column.title : '',
		)
		const [invalidTitle, setInvalidTitle] = useState<boolean>(false)
		const [invalidMessage, setInvalidMessage] = useState<string>('')

		useEffect(() => {
			setNewTitle(props.column ? props.column.title : '')
			setInvalidTitle(false)
		}, [props.open, props.column])

		const handleSave = async () => {
			const invalidTitle = !isTitleValid(newTitle)
			setInvalidTitle(invalidTitle)

			if (invalidTitle) {
				return
			}

			if (props.column) {
				if (props.column.title !== newTitle) {
					const oldTitle = props.column.title
					props.column.title = newTitle
					props.onSave(props.column, oldTitle)
				} else {
					props.onClose()
				}
			} else if (props.order !== undefined) {
				const newColumn: NoteColumnEntity = {
					title: newTitle,
					order: props.order,
				}
				props.onSave(newColumn)
			}
		}

		const handleTitleChange = (newTitle: string) => {
			setNewTitle(newTitle.substring(0, NoteColumnConstants.TITLE_MAX))
		}

		const isTitleValid = (title: string): boolean => {
			const unchangedTitle = props.column && props.column.title === title
			if (unchangedTitle) {
				return true
			}

			const minLengthError = title.length < NoteColumnConstants.TITLE_MIN
			if (minLengthError) {
				setInvalidMessage(language.data.COLUMN_MIN_LENGTH_ERROR)
				return false
			}

			const titleConflict = props.titleAlreadyExists(title)
			if (titleConflict) {
				setInvalidMessage(language.data.COLUMN_TITLE_ALREADY_EXISTS_ERROR)
				return false
			}

			setInvalidMessage('')
			return true
		}

		return (
			<DinoDialog
				open={props.open}
				header={
					<DinoDialogHeader>
					{props.column ? language.data.COLUMN_EDIT_LABEL : language.data.COLUMN_ADD_LABEL}
					</DinoDialogHeader>
				}
				handleSave={handleSave}
				handleClose={props.onClose}
			>
				<NoteColumnDialogContent
					title={newTitle}
					onTitleChange={handleTitleChange}
					invalidTitle={invalidTitle}
					invalidMessage={invalidMessage}
					inputRef={inputRef}
				/>
			</DinoDialog>
		)
	},
)

export default NoteColumnDialog
