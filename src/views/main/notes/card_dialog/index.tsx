import React, { useState, useEffect } from 'react'
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
    const [open, setOpen] = useState(props.open)
    const [text, setText] = useState('')
    const [tagList, setTagList] = useState(props.model.tagList)

    const handleChange = (event: React.ChangeEvent<{}>, values: any) => {
        console.log(values)
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

        const changeState = props.open !== open

        if (changeState) {
            setOpen(props.open)

            const changeClosedToOpen = props.open

            if (changeClosedToOpen) {
                if (props.questionCard) {
                    setTagList(props.model.tagList)
                }

                setText(defineText())
            }
        }
    },[props, open, tagList])

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
                {props.questionCard && 
                    <Autocomplete
                        multiple
                        value={tagList}
                        onChange={handleChange}
                        options={props.tagOptions}
                        renderInput={(params) => 
                            <TextField {...params} 
                                fullWidth
                                label="Dar nome" 
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