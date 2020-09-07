import React, {useState, useEffect} from 'react'
import Button from '@material-ui/core/Button'
import {
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
} from '@material-ui/core'
import TransitionSlide from '../../../../components/slide_transition'
import QuestionDialogFormProps from './props'
import { useLanguage, useCurrentFaq } from '../../../../context_provider/app_settings'
import SelectFaq from '../select_faq'
import './styles.css'
import FaqService from '../../../../services/faq/FaqService'

const QuestionDialogForm = React.forwardRef(({
    dialogOpen,
    setDialogOpen,
    }: QuestionDialogFormProps,
    ref: React.Ref<unknown>
  ): JSX.Element => {
    
    const language = useLanguage().current

    const currentFaq = useCurrentFaq()
  
    const [selectedFaq, setSelectedFaq] = useState(currentFaq)
    const [error, setError] = useState(false)

    const handleClose = () => {
        setDialogOpen(false)
    }

    const handleSave = () => {
      if(selectedFaq !== undefined && question !== '') {
        FaqService.saveUserQuestion(selectedFaq, question)
        handleClose()
      } else {
        if (question === '') {
          setError(true)
        }
      }
    }

    const [question, setQuestion] = useState('')

    useEffect(() => {
        if(dialogOpen === false) {
            return () => {
                setQuestion('')
                setSelectedFaq(currentFaq)
                setError(false)
            }
        }
    }, [dialogOpen, currentFaq])

    const handleChangeQuestion = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuestion(event.target.value as string)
    }

    const CHARACTER_LIMIT = 200

    return (
      <Dialog
        ref={ref}
        open={dialogOpen}
        fullWidth
        onClose={handleClose}
        TransitionComponent={TransitionSlide}
      >
        
        <DialogContent dividers>
          <SelectFaq
              selectedFaq={selectedFaq}
              setSelectedFaq={setSelectedFaq}
          />
          <TextField
              required
              fullWidth
              multiline
              rowsMax={7}
              value={question}
              onChange={handleChangeQuestion}
              autoFocus
              margin="dense"
              id="question"
              label={language.FORM_QUESTION}
              placeholder={language.FORM_QUESTION_PLACEHOLDER}
              type="question"
              inputProps={{maxLength: CHARACTER_LIMIT}}
              helperText={`${question.length}/${CHARACTER_LIMIT}`} 
              error={question.length === CHARACTER_LIMIT || error} 
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="primary"
          >
            {language.DIALOG_CANCEL_BUTTON_TEXT}
          </Button>

          <Button
            onClick={handleSave}
            color="primary"
          >
            {language.DIALOG_SAVE_BUTTON_TEXT}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
)

export default QuestionDialogForm
