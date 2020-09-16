import React, { useState, useEffect } from 'react'
import './styles.css'
import NoteInfoDialogProps from './props'
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@material-ui/core'
import TransitionSlide from '../../../../components/slide_transition'
import DateUtils from '../../../../utils/DateUtils'
import { useLanguage } from '../../../../context_provider/app_settings'
import NoteConstants from '../../../../constants/NoteConstants'
import Autocomplete from '@material-ui/lab/Autocomplete'
import DiscreetTextField from '../../../../components/discreet_text_field'
import ArrayUtils from '../../../../utils/ArrayUtils'

const NoteInfoDialog: React.FC<NoteInfoDialogProps> = ({
    note,
    open,
    tagOptions,
    onSave,
    onClose,
    questionAlreadyExists
}) => {
    const language = useLanguage().current

    const [question, setQuestion] = useState(note.question)
    const [answer, setAnswer] = useState(note.answer)
    const [tagList, setTagList] = useState(note.tagNames)

    const [editedQuestion, setEditedQuestion] = useState(false)
    const [editedAnswer, setEditedAnswer] = useState(false)
    const [editedTagList, setEditedTagList] = useState(false)

    const [questionWithError, setQuestionWithError] = useState(false)
    const [questionErrorHelper, setQuestionErrorHelper] = useState('')

    useEffect(() => {
        setAnswer(note.answer)
        setQuestion(note.question)
        setTagList(note.tagNames)
        setEditedQuestion(false)
        setEditedAnswer(false)
        setEditedTagList(false)
    }, [note])

    const handleQuestionChange = (newQuestion: string) => {
        const validQuestion = newQuestion.substring(0, NoteConstants.QUESTION_MAX_LENGTH)
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
        console.log("salvando")
        const newQuestion = question.trim()

        if (editedQuestion && !validateQuestion(newQuestion)) {
            return
        }

        onSave(question, answer, tagList)
    }

    const isEdited = () => (
        editedTagList || editedAnswer || editedQuestion
    )

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

        if(questionWithError) {
            setQuestionWithError(false)
            setQuestionErrorHelper('')
        }

        return true
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            TransitionComponent={TransitionSlide}
        >
            <DialogTitle className='note_info_dialog__title'>
                <DiscreetTextField 
                    error={questionWithError}
                    helperText={questionErrorHelper}
                    text={question}
                    onChange={handleQuestionChange}
                    className="note__info_dialog__title__question"
                />
            </DialogTitle>
            <div className='note_info_dialog__last_update'>
                <h4>
                    {language.NOTE_INFO_DIALOG_LAST_UPDATE_TITLE + ' '}
                    {DateUtils.getDateStringFormated(
                        note.lastUpdate,
                        language
                    )}
                </h4>
            </div>
            <DialogContent className='note__info_dialog__content'>
                <TextField
                    label={language.ANSWER_NOTE_DIALOG_TITLE}
                    type="text"
                    multiline
                    variant="standard"
                    value={answer}
                    onChange={handleAnswerChange}
                    className='note__info_dialog__content__answer'
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
            <DialogActions className='note__info_dialog__actions'>
                {isEdited() && <Button onClick={handleSaveNote}>{language.DIALOG_SAVE_BUTTON_TEXT}</Button>}
                <Button onClick={onClose}>{language.CLOSE_ARIA_LABEL}</Button>
            </DialogActions>
        </Dialog>
    )
}

export default NoteInfoDialog