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
import { useUserSettings } from '../../../../context/provider/user_settings'
import { useFaq } from '../../../../context/provider/faq'
import { useTreatment } from '../../../../context/provider/treatment/index'
import './styles.css'
import FaqUserQuestionService from '../../../../services/faq/FaqUserQuestionService'

const QuestionDialogForm = React.forwardRef(
  (
    { dialogOpen, setDialogOpen }: QuestionDialogFormProps,
    ref: React.Ref<unknown>
  ): JSX.Element => {
    const userSettings = useUserSettings()
    const language = userSettings.service.getLanguage(userSettings)
    const treatment = useTreatment()
    const faq = useFaq()
    const currentTreatment = userSettings.service.getTreatment(userSettings, treatment.data)
    const currentFaq = faq.service.getCurrentFaq(currentTreatment, faq.data)
    const [selectedFaq, setSelectedFaq] = useState(currentFaq)
    const [error, setError] = useState(false)

    const handleClose = () => {
      setDialogOpen(false)
    }

    const handleSave = () => {
      if (selectedFaq !== undefined && question !== '') {
        const entity: FaqUserQuestionEntity = {
          question: question,
          localFaqId: selectedFaq.localId
        }

        FaqUserQuestionService.save(entity)

        handleClose()
      } else {
        if (question === '') {
          setError(true)
        }
      }
    }

    const [question, setQuestion] = useState('')

    useEffect(() => {
      if (dialogOpen === false) {
        return () => {
          setQuestion('')
          setSelectedFaq(currentFaq)
          setError(false)
        }
      }
    }, [dialogOpen, currentFaq])

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
              label={language.FORM_QUESTION}
              placeholder={language.FORM_QUESTION_PLACEHOLDER}
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
              {language.DIALOG_CANCEL_BUTTON_TEXT}
            </Button>

            <Button onClick={handleSave}>
              {language.DIALOG_SAVE_BUTTON_TEXT}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
)

export default QuestionDialogForm
