import React, { useState, useEffect, useContext } from 'react'
import { LanguageContext } from '../../../../provider/language_provider'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import AnswerProps from './props'
import DialogActions from '../dialog_actions'

const AnswerDialog = (props: AnswerProps): JSX.Element => {
    const languageProvider = useContext(LanguageContext)
    const language = languageProvider.currentLanguage

    const [open, setOpen] = useState(false)
    const [answer, setAnswer] = useState('')

    const handleSave = () => {
        props.onSave(answer)
    }

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAnswer(event.target.value)
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
    },[props.open, props.answer, open])

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
      <Dialog open={open} className='note_card_dialog' onClose={props.onClose}  aria-labelledby={language.ANSWER_DIALOG_LABEL}>
            {renderDialogContent()}
            <DialogActions onSave={handleSave}/>
      </Dialog>
    )
}


export default AnswerDialog