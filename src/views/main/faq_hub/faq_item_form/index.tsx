import { TextField } from '@material-ui/core'
import React, { useState } from 'react'
import DinoDialog, { DinoDialogContent } from '../../../../components/dialogs/dino_dialog'
import DataConstants from '../../../../constants/app_data/DataConstants'
import { useLanguage } from '../../../../context/language'
import FaqItemService from '../../../../services/faq/FaqItemService'
import FaqItemEntity from '../../../../types/faq/database/FaqItemEntity'
import TreatmentEntity from '../../../../types/treatment/database/TreatmentEntity'
import StringUtils from '../../../../utils/StringUtils'

interface FaqItemFormProps {
  open: boolean,
  onClose: () => void,
  treatment: TreatmentEntity,
  faqItem?: FaqItemEntity
}

const FaqItemForm: React.FC<FaqItemFormProps> = ({ open, onClose, treatment, faqItem }) => {

  const [item, setItem] = useState(faqItem || { question: '', answer: '', localTreatmentId: treatment.localId })
  const [errorQuestion, setErrorQuestion] = useState(false)
  const [errorAnswer, setErrorAnswer] = useState(false)

  const language = useLanguage()

  const handleSave = () => {
    const errorQ = StringUtils.isEmpty(item.question)
    setErrorQuestion(errorQ)
    const errorA = StringUtils.isEmpty(item.answer)
    setErrorAnswer(errorA)
    if(!errorQ && !errorA) {
      FaqItemService.save(item)
      onClose()
    }
  }

  return (
    <DinoDialog
      open={open}
      onClose={onClose}
      onSave={handleSave}
    >
      <DinoDialogContent>
        <TextField
          className='dino__textfield'
          margin='dense'
          required={DataConstants.FAQ_QUESTION.REQUIRED}
          fullWidth
          label={language.data.FORM_QUESTION}
          type='name'
          inputProps={{ maxLength: DataConstants.FAQ_QUESTION.MAX }}
          helperText={(errorQuestion && language.data.EMPTY_FIELD_ERROR) || `${item.question.length}/${DataConstants.FAQ_QUESTION.MAX}` }
          value={item.question}
          onChange={(e) => setItem({ ...item, question: e.target.value })}
          error={errorQuestion}
        />
        <TextField
        	className='dino__textfield'
          margin='dense'
          required={DataConstants.FAQ_ANSWER.REQUIRED}
          fullWidth
          multiline
          rows={7}
          label={'Answer'}
          type='name'
          inputProps={{ maxLength: DataConstants.FAQ_ANSWER.MAX }}
          helperText={(errorAnswer && language.data.EMPTY_FIELD_ERROR) || `${item.answer.length}/${DataConstants.FAQ_ANSWER.MAX}`}
          value={item.answer}
          onChange={(e) => setItem({ ...item, answer: e.target.value })}
          error={errorAnswer}
        />
      </DinoDialogContent>
    </DinoDialog>
  )
}

export default FaqItemForm