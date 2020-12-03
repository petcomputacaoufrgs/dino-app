import React, { useState, useEffect } from 'react'
import Button from '../../../../components/button/text_button'
import './styles.css'
import NoteInfoDialogProps from './props'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@material-ui/core'
import TransitionSlide from '../../../../components/slide_transition'
import DateUtils from '../../../../utils/DateUtils'
import { useCurrentLanguage } from '../../../../context/provider/app_settings'
import NoteConstants from '../../../../constants/note/NoteConstants'
import Autocomplete from '@material-ui/lab/Autocomplete'
import DiscreetTextField from '../../../../components/discreet_text_field'
import ArrayUtils from '../../../../utils/ArrayUtils'
import { ReactComponent as DeleteOutlineIcon } from '../../../../assets/icons/delete.svg'
import IconButton from '../../../../components/button/icon_button'
import AgreementDialog from '../../../../components/agreement_dialog'

const NoteInfoDialog: React.FC<NoteInfoDialogProps> = ({
  note,
  open,
  tagOptions,
  onSave,
  onClose,
  onDelete,
  questionAlreadyExists,
}) => {
  const language = useCurrentLanguage()

  const [question, setQuestion] = useState(note.question)
  const [answer, setAnswer] = useState(note.answer)
  const [tagList, setTagList] = useState(note.tagNames)

  const [editedQuestion, setEditedQuestion] = useState(false)
  const [editedAnswer, setEditedAnswer] = useState(false)
  const [editedTagList, setEditedTagList] = useState(false)

  const [questionWithError, setQuestionWithError] = useState(false)
  const [questionErrorHelper, setQuestionErrorHelper] = useState('')

  const [deleteNoteDialogOpen, setDeleteNoteDialogOpen] = useState(false)

  useEffect(() => {
    setAnswer(note.answer)
    setQuestion(note.question)
    setTagList(note.tagNames)
    setEditedQuestion(false)
    setEditedAnswer(false)
    setEditedTagList(false)
  }, [note])

  const handleQuestionChange = (newQuestion: string) => {
    const validQuestion = newQuestion.substring(
      0,
      NoteConstants.QUESTION_MAX_LENGTH
    )
    const questionChanged = note.question !== validQuestion.trim()

    setQuestion(validQuestion)
    setEditedQuestion(questionChanged)

    if (questionWithError) {
      setQuestionWithError(false)
      setQuestionErrorHelper('')
    }
  }

  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    const validAnswer = value.substring(0, NoteConstants.ANSWER_MAX_LENGTH)
    const answerChanged = note.answer !== validAnswer.trim()

    setAnswer(validAnswer)
    setEditedAnswer(answerChanged)
  }

  const handleTagChange = (event: React.ChangeEvent<{}>, values: string[]) => {
    if (values.length <= NoteConstants.TAG_LIMIT) {
      const changed = ArrayUtils.notEqualIgnoreOrder(values, note.tagNames)
      setTagList(values)
      setEditedTagList(changed)
    }
  }

  const handleSaveNote = () => {
    const newQuestion = question.trim()

    if (editedQuestion && !validateQuestion(newQuestion)) {
      return
    }

    onSave(question, answer, tagList)
  }

  const handleDeleteNoteAgree = () => {
    onDelete()

    setDeleteNoteDialogOpen(false)
  }

  const handleDeleteNoteDisagree = () => {
    setDeleteNoteDialogOpen(false)
  }

  const handleDeleteNote = () => {
    setDeleteNoteDialogOpen(true)
  }

  const isEdited = () => editedTagList || editedAnswer || editedQuestion

  const validateQuestion = (newQuestion: string): boolean => {
    if (!newQuestion) {
      setQuestionWithError(true)
      setQuestionErrorHelper(language.EMPTY_FIELD_ERROR)
      return false
    }

    if (newQuestion !== note.question && questionAlreadyExists(newQuestion)) {
      setQuestionWithError(true)
      setQuestionErrorHelper(language.QUESTION_ALREADY_EXISTS_ERROR)
      return false
    }

    if (questionWithError) {
      setQuestionWithError(false)
      setQuestionErrorHelper('')
    }

    return true
  }

  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={TransitionSlide}>
      <DialogTitle disableTypography className="note_info_dialog__title">
        <DiscreetTextField
          error={questionWithError}
          helperText={questionErrorHelper}
          text={question}
          onChange={handleQuestionChange}
          className="note__info_dialog__title__question"
        />
        <IconButton
          className="note_info_dialog__delete_icon"
          icon={DeleteOutlineIcon}
          onClick={handleDeleteNote}
        />
      </DialogTitle>
      <div className="note_info_dialog__last_update">
        <h4>{DateUtils.getDateStringFormated(note.lastUpdate, language)}</h4>
      </div>
      <DialogContent className="note__info_dialog__content">
        <TextField
          label={`${language.ANSWER_NOTE_DIALOG_TITLE} (${language.MAX} ${NoteConstants.ANSWER_MAX_LENGTH})`}
          type="text"
          multiline
          variant="standard"
          value={answer}
          onChange={handleAnswerChange}
          className="note__info_dialog__content__answer"
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
              variant="standard"
              inputProps={{
                ...params.inputProps,
                maxLength: NoteConstants.TAG_MAX_LENGTH,
              }}
            />
          )}
        />
      </DialogContent>
      <DialogActions className="note__info_dialog__actions">
        {isEdited() && (
          <Button onClick={handleSaveNote}>
            {language.DIALOG_SAVE_BUTTON_TEXT}
          </Button>
        )}
        <Button onClick={onClose}>{language.CLOSE_ARIA_LABEL}</Button>
      </DialogActions>
      <AgreementDialog
        onAgree={handleDeleteNoteAgree}
        onDisagree={handleDeleteNoteDisagree}
        question={language.DELETE_NOTE_ALERT_TITLE}
        description={language.DELETE_NOTE_ALERT_TEXT}
        agreeOptionText={language.AGREEMENT_OPTION_TEXT}
        disagreeOptionText={language.DISAGREEMENT_OPTION_TEXT}
        open={deleteNoteDialogOpen}
      />
    </Dialog>
  )
}

export default NoteInfoDialog
