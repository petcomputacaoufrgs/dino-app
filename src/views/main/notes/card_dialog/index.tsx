import React, { useState, useEffect } from 'react'
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import SaveIcon from '@material-ui/icons/Save'
import NotesCardDialogProps from './props'
import './styles.css'

const NotesCardDialog = (props: NotesCardDialogProps): JSX.Element => {
    const [open, setOpen] = useState(props.open)
    const [text, setText] = useState('')

    const handleSave = () => {
        props.onSave(props.model.id, text)
    }

    const handlenCloseCardDialog = () => {
        props.onClose()
    }

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value)
    }

    useEffect(() => {
        const defineText = (): string => {
            if (props.questionCard) {
                if (props.model && props.model.question) {
                    return props.model.question
                }
            } else {
                if (props.model && props.model?.answer) {
                    return props.model.answer
                }
            }
            
    
            return ''
        }

        if (props.open !== open) {
            setOpen(props.open)
        }

        if (props.open) {
            setText(defineText())
        }

    },[props.open, props.questionCard, props.model, open])

    const renderDialogContent = (): JSX.Element => {
        const label = props.questionCard ? 'Question' : 'Answer'

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
            </DialogContent>
        )
    }

    const renderDialogActions = () => (
        <DialogActions className='card_dialog__save'>
          <Button 
            onClick={handleSave} 
            variant="contained"
            size="small"
            startIcon={<SaveIcon />}
        >
            Save
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