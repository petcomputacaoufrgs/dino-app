import React, { useState } from 'react'
import QuestionDialog from '../question_dialog'
import './styles.css'
import ButtonAdd from '../../../../components/button_add'

const NoteAddButton = (props: {
  tags: string[]
  onSave: (question: string, tags: string[]) => void
}) => {

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
      <ButtonAdd onClick={handleOpenNewQuestionDialog}/>
    </>
  )
}

export default NoteAddButton
