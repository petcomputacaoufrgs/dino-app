import React from 'react'
import './styles.css'
import NotesContentColumnAddNoteProps from './props'
import { Button } from '@material-ui/core'
import { useCurrentLanguage } from '../../../../../../context/provider/app_settings'
import NoteConstants from '../../../../../../constants/note/NoteConstants'

const NotesContentColumnAddNote: React.FC<NotesContentColumnAddNoteProps> = ({
  onAdd,
  notesCount,
}) => {
  const language = useCurrentLanguage()

  const maxNotes = notesCount >= NoteConstants.MAX_NOTES_PER_COLUMN

  return (
    <Button
      className="note__note_content__column__add_note"
      onClick={onAdd}
      disabled={maxNotes}
    >
      <h3>
        + {language.NOTE_COLUMN_ADD_NOTE_TEXT} (
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
