import React, { useState, useEffect, useContext } from 'react'
import { LanguageContext } from '../../../../components/language_provider'
import DialogActions from '../dialog_actions'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import Autocomplete from '@material-ui/lab/Autocomplete'
import QuestionDialogProps from './props'

const QuestionDialog = (props: QuestionDialogProps): JSX.Element => {
    const languageProvider = useContext(LanguageContext)
    const language = languageProvider.currentLanguage

    const [open, setOpen] = useState(props.open)
    const [question, setQuestion] = useState('')
    const [tagList, setTagList] = useState([] as string[])

    const handleChange = (event: React.ChangeEvent<{}>, values: any) => {        
        setTagList(values)
    }

    const handleSave = () => {
        props.onSave(question, tagList)
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
            }
        }
    },[props.open, props.tagList, props.question, open, tagList])

    const renderDialogContent = (): JSX.Element => {
        return (
            <DialogContent>
                <TextField
                    autoFocus
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
                    renderInput={(params) => 
                        <TextField {...params} 
                            fullWidth
                            label={language.NOTE_TAG_LABEL}
                            variant="outlined" />
                    }
                />
            </DialogContent>
        )
    }
  
    return (
      <Dialog open={open} className='note_card_dialog' onClose={props.onClose} aria-labelledby="form-dialog-title">
          {renderDialogContent()}
          <DialogActions onSave={handleSave} />
      </Dialog>
    )
}


export default QuestionDialog