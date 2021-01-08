import React, { useState, useEffect } from 'react'
import Button from '../../../../components/button/text_button'
import {
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
} from '@material-ui/core'
import TransitionSlide from '../../../../components/slide_transition'
import QuestionDialogFormProps from './props'
import Constants from '../../../../constants/faq/FaqConstants'
import FaqUserQuestionEntity from '../../../../types/faq/database/FaqUserQuestionEntity'
import FaqUserQuestionService from '../../../../services/faq/FaqUserQuestionService'
import { useLanguage } from '../../../../context/language'
import './styles.css'

const QuestionDialogForm = React.forwardRef(
  (
    { dialogOpen, setDialogOpen, faq }: QuestionDialogFormProps,
    ref: React.Ref<unknown>
  ): JSX.Element => {
    const language = useLanguage()
    const [question, setQuestion] = useState('')
    const [error, setError] = useState(false)

    const handleClose = () => {
      setDialogOpen(false)
    }

    const handleSave = () => {
      if (faq && question !== '') {
        const entity: FaqUserQuestionEntity = {
          question: question,
          localFaqId: faq.localId,
        }

        FaqUserQuestionService.save(entity)

        handleClose()
      } else {
        if (question === '') {
          setError(true)
        }
      }
    }

    useEffect(() => {
      if (dialogOpen === false) {
        return () => {
          setQuestion('')
          setError(false)
        }
      }
    }, [dialogOpen])

    const handleChangeQuestion = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      setQuestion(event.target.value as string)
    }

    return (
        <div className="dialog-form">
          <Dialog
            ref={ref}
            open={dialogOpen}
            fullWidth
            onClose={handleClose}
            TransitionComponent={TransitionSlide}
          >
            <DialogContent dividers>
              <TextField
                required
                fullWidth
                value={question}
                onChange={handleChangeQuestion}
                autoFocus
                margin="dense"
                id="question"
                label={language.data.FORM_QUESTION}
                placeholder={language.data.FORM_QUESTION_PLACEHOLDER}
                type="question"
                multiline
                rowsMax={7}
                inputProps={{ maxLength: Constants.USER_QUESTION_MAX }}
                helperText={`${question.length}/${Constants.USER_QUESTION_MAX}`}
                error={question.length === Constants.USER_QUESTION_MAX || error}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>
                {language.data.DIALOG_CANCEL_BUTTON_TEXT}
              </Button>

              <Button onClick={handleSave}>
                {language.data.DIALOG_SAVE_BUTTON_TEXT}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
    )
  }
)

export default QuestionDialogForm
