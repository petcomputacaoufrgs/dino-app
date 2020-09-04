import React, { useState } from 'react'
import NoteAddButtonProps from './props'
import './styles.css'
import NoteDialog from '../note_dialog'
import { Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { useLanguage } from '../../../../context_provider/app_settings'

const NoteAddButton: React.FC<NoteAddButtonProps> = ({
  tags,
  onSave
}) => {
  const language = useLanguage().current

  const [newNoteDialogOpen, setNewNoteDialogOpen] = useState(false)

  const handleOpenNewQuestionDialog = () => {
    setNewNoteDialogOpen(true)
  }

  const handleCloseNewNoteDialog = () => {
    setNewNoteDialogOpen(false)
  }

  const handleSaveNewNote = (
    question: string,
    tagList: string[],
    answer: string
  ) => {
    onSave(question, tagList, answer)
    setNewNoteDialogOpen(false)
  }

  return (
    <>
      <NoteDialog
        open={newNoteDialogOpen}
        tagOptions={tags}
        onSave={() => {}}
        onSaveNew={handleSaveNewNote}
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
