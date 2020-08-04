import React, { useState } from 'react'
import QuestionDialog from '../question_dialog'
import { Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { useLanguage } from '../../../../provider/app_settings_provider'
import './styles.css'

const NoteAddButton = (props: {
  tags: string[]
  onSave: (question: string, tags: string[]) => void
}) => {
  const language = useLanguage().current

  const [newNoteDialogOpen, setNewNoteDialogOpen] = useState(false)

  const handleOpenNewQuestionDialog = () => {
    setNewNoteDialogOpen(true)
  }

  const handleCloseNewNoteDialog = () => {
    setNewNoteDialogOpen(false)
  }

  const handleSaveNewNote = (question: string, tags: string[]) => {
    props.onSave(question, tags)
    setNewNoteDialogOpen(false)
  }

  return (
    <>
      <QuestionDialog
        open={newNoteDialogOpen}
        question={''}
        tagList={[]}
        tagOptions={props.tags}
        onSave={handleSaveNewNote}
        onClose={handleCloseNewNoteDialog}
      />
      <Fab
        onClick={handleOpenNewQuestionDialog}
        className="notes__add"
        aria-label={language.NOTES_ADD_BUTTON}
      >
        <AddIcon />
      </Fab>
    </>
  )
}

export default NoteAddButton
