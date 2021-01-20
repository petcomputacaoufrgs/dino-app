import React from 'react'
import './styles.css'
import NotesContentColumnAddNoteProps from './props'
import Button from '../../../../../../components/button/text_button'
import NoteConstants from '../../../../../../constants/note/NoteConstants'
import { useLanguage } from '../../../../../../context/language'

const NotesContentColumnAddNote: React.FC<NotesContentColumnAddNoteProps> = ({
	onAdd,
	notesCount,
}) => {
	const language = useLanguage()

	const maxNotes = notesCount >= NoteConstants.MAX_NOTES_PER_COLUMN

	return (
		<Button
			className='note__note_content__column__add_note'
			onClick={onAdd}
			disabled={maxNotes}
		>
			<h3>
				+ {language.data.NOTE_COLUMN_ADD_NOTE_TEXT} (
				<span
					className={
						maxNotes ? 'note__note_content__column__add_note__max_notes' : ''
					}
				>
					{notesCount}/{NoteConstants.MAX_NOTES_PER_COLUMN}
				</span>
				)
			</h3>
		</Button>
	)
}

export default NotesContentColumnAddNote
