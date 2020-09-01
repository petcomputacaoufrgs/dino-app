import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../../../context_provider/app_settings'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import AnswerProps from './props'
import DialogActions from '../dialog_actions'
import NoteConstants from '../../../../constants/NoteConstants'

const AnswerDialog = (props: AnswerProps): JSX.Element => {
  const language = useLanguage().current

  const [open, setOpen] = useState(false)
  const [answer, setAnswer] = useState('')

  const handleSave = () => {
    props.onSave(answer)
  }

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    setAnswer(value.substring(0, NoteConstants.ANSWER_MAX_LENGTH))
  }

  useEffect(() => {
    const openStateChanged = props.open !== open

    if (openStateChanged) {
      setOpen(props.open)

      const changedToOpen = props.open

      if (changedToOpen) {
        setAnswer(props.answer ? props.answer : '')
      }
    }
  }, [props.open, props.answer, open])

  const renderDialogContent = (): JSX.Element => {
    return (
      <DialogContent>
        <TextField
          autoFocus
          multiline
          id="text"
          label={language.ANSWER_NOTE_DIALOG_TITLE}
          type="text"
          variant="outlined"
          value={answer}
          onChange={handleTextChange}
        />
      </DialogContent>
    )
  }

  return (
    <Dialog
      open={open}
      className="note_card_dialog"
      onClose={props.onClose}
    >
      {renderDialogContent()}
      <DialogActions onSave={handleSave} />
    </Dialog>
  )
}

export default AnswerDialog
