import React, { useState, useEffect, useContext } from 'react'
import { LanguageContext } from '../../../../components/language_provider'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import SaveIcon from '@material-ui/icons/Save'
import Autocomplete from '@material-ui/lab/Autocomplete'
import NotesCardDialogProps from './props'
import './styles.css'

const NotesCardDialog = (props: NotesCardDialogProps): JSX.Element => {
    const languageProvider = useContext(LanguageContext)
    const language = languageProvider.currentLanguage

    const [open, setOpen] = useState(props.open)
    const [text, setText] = useState('')
    const [tagList, setTagList] = useState([] as string[])

    const handleChange = (event: React.ChangeEvent<{}>, values: any) => {
        setTagList(values)
    }

    const handleSave = () => {
        props.onSave(props.model.id, text, tagList)
    }

    const handlenCloseCardDialog = () => {
        props.onClose()
    }

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value)
    }

    useEffect(() => {
        const defineText = (): string => {
            if (props.newCard) {
                return ''
            }

            if (props.questionCard) {
                return props.model.question
            }
            
            return props.model.answer
        }

        const stateChanged = props.open !== open

        if (stateChanged) {
            setOpen(props.open)

            const changedToOpen = props.open

            if (changedToOpen) {
                if (props.questionCard && !props.newCard) {
                    setTagList(props.model.tagList)
                }

                setText(defineText())
            }
        }
    },[props, open, tagList])

    const renderDialogContent = (): JSX.Element => {
        const label = props.questionCard ? language.QUESTION_NOTE_DIALOG_TITLE : language.ANSWER_NOTE_DIALOG_TITLE

        return (
            <DialogContent>
                <TextField
                    autoFocus
                    id="text"
                    label={label}
                    type="text"
                    multiline
                    variant="outlined"
                    value={text} 
                    onChange={handleTextChange} 
                />
                {props.questionCard && 
                    <Autocomplete
                        multiple
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
                }
            </DialogContent>
        )
    }

    const renderDialogActions = () => (
        <DialogActions className='card_dialog__save'>
          <Button 
            onClick={handleSave} 
            aria-label={language.NOTE_DIALOG_SAVE_BUTTON_LABEL}
            variant="contained"
            size="small"
            startIcon={<SaveIcon />}
        >
            {language.NOTE_DIALOG_SAVE_BUTTON_TEXT}
          </Button>
        </DialogActions>
    )
  
    return (
      <Dialog open={open} className='card_dialog' onClose={handlenCloseCardDialog} aria-labelledby="form-dialog-title">
          {renderDialogContent()}
          {renderDialogActions()}
      </Dialog>
    )
}


export default NotesCardDialog