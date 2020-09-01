import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../../../context_provider/app_settings'
import DialogActions from '../dialog_actions'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Autocomplete from '@material-ui/lab/Autocomplete'
import QuestionDialogProps from './props'
import StringUtils from '../../../../utils/StringUtils'
import NoteService from '../../../../services/note/NoteService'
import LogAppErrorService from '../../../../services/log_app_error/LogAppErrorService'

const QuestionDialog = (props: QuestionDialogProps): JSX.Element => {
  const language = useLanguage().current

  const [open, setOpen] = useState(props.open)
  const [originalQuestion, setOriginalQuestion] = useState('')
  const [question, setQuestion] = useState('')
  const [questionError, setQuestionError] = useState(false)
  const [errorHelper, setErrorHelper] = useState('')
  const [tagList, setTagList] = useState([] as string[])

  const handleChange = (event: React.ChangeEvent<{}>, values: any) => {
    setTagList(values)
  }

  const handleSave = () => {
    if (question.length === 0) {
      setQuestionError(true)
      setErrorHelper(language.EMPTY_FIELD_ERROR)

      return
    }

    if (StringUtils.areNotEqual(question, originalQuestion)) {
      NoteService.questionAlreadyExists(question)
        .then((exists) => {
          if (exists) {
            setQuestionError(true)
            setErrorHelper(language.QUESTION_ALREADY_EXISTS_ERROR)

            return
          }

          props.onSave(question, tagList)
        })
        .catch((e) => LogAppErrorService.saveError(e))
    } else {
      props.onSave(question, tagList)
    }
  }

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value)
  }

  useEffect(() => {
    const stateChanged = props.open !== open

    if (stateChanged) {
      setOpen(props.open)

      const changedToOpen = props.open

      if (changedToOpen) {
        setTagList(props.tagList)
        setQuestion(props.question)
        setOriginalQuestion(props.question)
      }
    }
  }, [props.open, props.tagList, props.question, open, tagList])

  const renderDialogContent = (): JSX.Element => {
    return (
      <DialogContent>
        <TextField
          autoFocus
          error={questionError}
          helperText={errorHelper}
          id="text"
          label={language.QUESTION_NOTE_DIALOG_TITLE}
          type="text"
          multiline
          variant="outlined"
          value={question}
          onChange={handleTextChange}
        />
        <Autocomplete
          multiple
          freeSolo
          value={tagList}
          onChange={handleChange}
          options={props.tagOptions}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label={language.NOTE_TAG_LABEL}
              variant="outlined"
            />
          )}
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

export default QuestionDialog
