import { TextField, Checkbox, FormControlLabel } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import DinoDialog, { DinoDialogContent } from '../../../../components/dialogs/dino_dialog'
import DataConstants from '../../../../constants/app_data/DataConstants'
import { useLanguage } from '../../../../context/language'
import FaqItemService from '../../../../services/faq/FaqItemService'
import TreatmentQuestionService from '../../../../services/treatment/TreatmentQuestionService'
import FaqItemEntity from '../../../../types/faq/database/FaqItemEntity'
import TreatmentQuestionEntity from '../../../../types/faq/database/TreatmentQuestionEntity'
import TreatmentEntity from '../../../../types/treatment/database/TreatmentEntity'
import StringUtils from '../../../../utils/StringUtils'

interface FaqItemFormProps {
  open: boolean,
  onClose: () => void,
  treatment: TreatmentEntity,
  faqItem?: FaqItemEntity,
  treatmentQuestion?: TreatmentQuestionEntity
}


const FaqItemForm: React.FC<FaqItemFormProps> = ({ open, onClose, treatment, faqItem, treatmentQuestion }) => {

  const getItem = (): FaqItemEntity => faqItem || { 
    question: treatmentQuestion?.question || '', answer: '', 
    localTreatmentId: treatment.localId, 
    isUniversal: DataConstants.FALSE 
  }

  const [item, setItem] = useState<FaqItemEntity>(getItem())

  useEffect(() => {
    if(open) setItem(getItem())
  }, [open])

  const ERROR_QUESTION = 1
  const ERROR_ANSWER = 2

  const [error, setError] = useState(0)

  const language = useLanguage()

  const handleSave = () => {

    const isValid = () => {
      if(StringUtils.isEmpty(item.question)) {
        setError(ERROR_QUESTION)
        return false
      }
      if(StringUtils.isEmpty(item.answer)){
        setError(ERROR_ANSWER)
        return false
      }
      return true 
    }

    if(isValid()) {
      item.localTreatmentId = item.isUniversal === DataConstants.TRUE ? undefined : treatment.localId
      FaqItemService.save(item)

      if(treatmentQuestion) //caso seja uma pergunta feita por um usuário, a deleta pois foi respondida
        TreatmentQuestionService.delete(treatmentQuestion)
      
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
          multiline
          rowsMax={10}
          label={language.data.FORM_QUESTION}
          type='name'
          inputProps={{ maxLength: DataConstants.FAQ_QUESTION.MAX }}
          helperText={(error === ERROR_QUESTION && language.data.EMPTY_FIELD_ERROR) || `${item.question.length}/${DataConstants.FAQ_QUESTION.MAX}` }
          value={item.question}
          onChange={(e) => setItem({ ...item, question: e.target.value })}
          error={error === ERROR_QUESTION}
        />
        <TextField
        	className='dino__textfield'
          margin='dense'
          required={DataConstants.FAQ_ANSWER.REQUIRED}
          fullWidth
          multiline
          rowsMax={10}
          label={language.data.FORM_ANSWER}
          type='name'
          inputProps={{ maxLength: DataConstants.FAQ_ANSWER.MAX }}
          helperText={(error === ERROR_ANSWER && language.data.EMPTY_FIELD_ERROR) || `${item.answer.length}/${DataConstants.FAQ_ANSWER.MAX}`}
          value={item.answer}
          onChange={(e) => setItem({ ...item, answer: e.target.value })}
          error={error === ERROR_ANSWER}
        />
        <hr/>
        <FormControlLabel
          label={language.data.SHOW_FAQ_ITEM_IN_ALL_FAQS_LABEL} 
          control={<Checkbox checked={Boolean(item.isUniversal)} onChange={(e) => setItem({ ...item, isUniversal: Number(e.target.checked) as 0 | 1 })} />}
        />
      </DinoDialogContent>
    </DinoDialog>
  )
}

export default FaqItemForm