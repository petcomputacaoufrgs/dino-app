import { TextField, Checkbox, FormControlLabel } from '@material-ui/core'
import React, { useState } from 'react'
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

  const [item, setItem] = useState(faqItem || { question: treatmentQuestion?.question || '', answer: '', localTreatmentId: treatment.localId })
  const [errorQuestion, setErrorQuestion] = useState(false)
  const [errorAnswer, setErrorAnswer] = useState(false)
  const [isUniversal, setIsUniversal] = useState(false)

  const language = useLanguage()

  const handleSave = () => {

    const isValid = () => {
      const errorQ = StringUtils.isEmpty(item.question)
      setErrorQuestion(errorQ)
      const errorA = StringUtils.isEmpty(item.answer)
      setErrorAnswer(errorA)
      return !errorQ && !errorA
    }

    if(isValid()) {
      if(isUniversal)
        item.localTreatmentId = DataConstants.FAQ_ITEM_UNIVERSAL
      
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
          rowsMax={10}
          label={language.data.FORM_ANSWER}
          type='name'
          inputProps={{ maxLength: DataConstants.FAQ_ANSWER.MAX }}
          helperText={(errorAnswer && language.data.EMPTY_FIELD_ERROR) || `${item.answer.length}/${DataConstants.FAQ_ANSWER.MAX}`}
          value={item.answer}
          onChange={(e) => setItem({ ...item, answer: e.target.value })}
          error={errorAnswer}
        />
        <hr/>
        <FormControlLabel
          label={"Is this an universal question?"} 
          control={<Checkbox checked={isUniversal} onChange={e => setIsUniversal(!isUniversal)} />}
        />
      </DinoDialogContent>
    </DinoDialog>
  )
}

export default FaqItemForm