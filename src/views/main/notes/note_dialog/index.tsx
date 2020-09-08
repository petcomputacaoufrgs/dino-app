import React, { useState, useEffect } from 'react'
import NoteDialogProps from './props'
import './styles.css'
import { useLanguage } from '../../../../context_provider/app_settings'
import DialogActions from './actions'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Autocomplete from '@material-ui/lab/Autocomplete'
import StringUtils from '../../../../utils/StringUtils'
import NoteService from '../../../../services/note/NoteService'
import NoteConstants from '../../../../constants/NoteConstants'
import NoteViewModel from '../../../../types/note/view/NoteViewModel'

const NoteDialog: React.FC<NoteDialogProps> = ({
  onClose,
  onSave,
  onSaveNew,
  open,
  tagOptions,
  note
}): JSX.Element => {
  const language = useLanguage().current

  const [openDialog, setOpenDialog] = useState(open)

  const [originalQuestion, setOriginalQuestion] = useState(
    note ? note.question : ''
  )

  const [question, setQuestion] = useState(note ? note.question : '')
  const [questionWithError, setQuestionWithError] = useState(false)
  const [questionErrorHelper, setQuestionErrorHelper] = useState('')

  const [answer, setAnswer] = useState(note && note.answer ? note.answer : '')

  const [tagList, setTagList] = useState(note ? note.tagNames : [])

  const handleChange = (event: React.ChangeEvent<{}>, values: string[]) => {
    const validValues = values.filter(value => value.length <= NoteConstants.TAG_MAX_LENGTH)

    if (validValues.length <= NoteConstants.TAG_LIMIT) {
      setTagList(validValues)
    }
  }

  const handleSave = () => {
    if (note === undefined) {
      saveNewNote()
    } else {
      saveNote(note)
    }
  }

  const handleQuestionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    setQuestion(value.substring(0, NoteConstants.QUESTION_MAX_LENGTH))
  }

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    setAnswer(value.substring(0, NoteConstants.ANSWER_MAX_LENGTH))
  }

  const saveNote = async (updatedNote: NoteViewModel) => {
    if (StringUtils.areNotEqual(question, originalQuestion)) {
      const alreadyExists = await NoteService.questionAlreadyExists(question)

      if (alreadyExists) {
        setQuestionWithError(true)
        setQuestionErrorHelper(language.QUESTION_ALREADY_EXISTS_ERROR)

        return
      }
    }

    updatedNote.question = question
    updatedNote.answer = answer
    updatedNote.tagNames = tagList

    onSave(updatedNote)
  }

  const saveNewNote = async () => {
    if (question.length === 0) {
      setQuestionWithError(true)
      setQuestionErrorHelper(language.EMPTY_FIELD_ERROR)

      return
    }

    const alreadyExists = await NoteService.questionAlreadyExists(question)

    if (alreadyExists) {
      setQuestionWithError(true)
      setQuestionErrorHelper(language.QUESTION_ALREADY_EXISTS_ERROR)

      return
    }

    onSaveNew(question, tagList, answer)
  }

  useEffect(() => {
    setOpenDialog(open)

    if (open) {
      setTagList(note ? note.tagNames : [])
      setQuestion(note ? note.question : '')
      setOriginalQuestion(note ? note.question : '')
      setAnswer(note && note.answer ? note.answer : '')
    }
  }, [open, note])

  const renderDialogContent = (): JSX.Element => {
    return (
      <DialogContent>
        <TextField
          error={questionWithError}
          helperText={questionErrorHelper}
          label={language.QUESTION_NOTE_DIALOG_TITLE}
          type="text"
          multiline
          variant="outlined"
          value={question}
          onChange={handleQuestionChange}
        />
        <TextField
          label={language.ANSWER_NOTE_DIALOG_TITLE}
          type="text"
          multiline
          variant="outlined"
          value={answer}
          onChange={handleAnswerChange}
        />
        <Autocomplete
          multiple
          freeSolo
          value={tagList}
          limitTags={1}
          onChange={handleChange}
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
    <Dialog open={openDialog} className="note_card_dialog" onClose={onClose}>
      {renderDialogContent()}
      <DialogActions onSave={handleSave} />
    </Dialog>
  )
}

export default NoteDialog
