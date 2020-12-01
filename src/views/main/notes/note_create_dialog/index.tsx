import React, { useState, useEffect } from 'react'
import Button from '../../../../components/button/text_button'
import './styles.css'
import NoteCreateDialogProps from './props'
import { useCurrentLanguage } from '../../../../context/provider/app_settings'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Autocomplete from '@material-ui/lab/Autocomplete'
import NoteConstants from '../../../../constants/note/NoteConstants'
import { DialogTitle, DialogActions } from '@material-ui/core'
import TransitionSlide from '../../../../components/slide_transition'

const NoteCreateDialog: React.FC<NoteCreateDialogProps> = ({
  onClose,
  onSave,
  open,
  tagOptions,
  questionAlreadyExists,
}): JSX.Element => {
  const language = useCurrentLanguage()

  const [question, setQuestion] = useState('')
  const [questionWithError, setQuestionWithError] = useState(false)
  const [questionErrorHelper, setQuestionErrorHelper] = useState('')

  const [tagList, setTagList] = useState<string[]>([])

  const handleTagChange = (event: React.ChangeEvent<{}>, values: string[]) => {
    if (values.length <= NoteConstants.TAG_LIMIT) {
      setTagList(values)
    }
  }

  const handleSave = () => {
    const newQuestion = question.trim()

    if (newQuestion.length === 0) {
      setQuestionWithError(true)
      setQuestionErrorHelper(language.EMPTY_FIELD_ERROR)

      return
    }

    if (questionAlreadyExists(newQuestion)) {
      setQuestionWithError(true)
      setQuestionErrorHelper(language.QUESTION_ALREADY_EXISTS_ERROR)

      return
    }

    onSave(newQuestion, tagList)
  }

  const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    const newQuestion = value.substring(0, NoteConstants.QUESTION_MAX_LENGTH)

    if (questionWithError) {
      setQuestionWithError(false)
      setQuestionErrorHelper('')
    }

    setQuestion(newQuestion)
  }

  useEffect(() => {
    if (open) {
      setTagList([])
      setQuestion('')
      setQuestionWithError(false)
      setQuestionErrorHelper('')
    }
  }, [open])

  const renderDialogContent = (): JSX.Element => {
    return (
      <DialogContent>
        <TextField
          error={questionWithError}
          helperText={questionErrorHelper}
          label={
            language.QUESTION_NOTE_DIALOG_TITLE +
            ' (' +
            language.MAX +
            NoteConstants.ANSWER_MAX_LENGTH +
            ')'
          }
          type="text"
          multiline
          variant="outlined"
          value={question}
          onChange={handleQuestionChange}
        />
        <Autocomplete
          multiple
          freeSolo
          value={tagList}
          limitTags={1}
          onChange={handleTagChange}
          options={tagOptions}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label={`${language.NOTE_TAG_LABEL} (${language.MAX} ${NoteConstants.TAG_LIMIT})`}
              variant="outlined"
              inputProps={{
                ...params.inputProps,
                maxLength: NoteConstants.TAG_MAX_LENGTH,
              }}
            />
          )}
        />
      </DialogContent>
    )
  }
  return (
    <Dialog
      open={open}
      className="note_create_dialog"
      onClose={onClose}
      TransitionComponent={TransitionSlide}
    >
      <DialogTitle>{language.NOTE_EDIT_DIALOG_NEW_NOTE_TITLE}</DialogTitle>
      {renderDialogContent()}
      <DialogActions>
        <Button onClick={onClose}>{language.DIALOG_CANCEL_BUTTON_TEXT}</Button>
        <Button onClick={handleSave}>{language.DIALOG_SAVE_BUTTON_TEXT}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default NoteCreateDialog
