import { TextField } from '@material-ui/core'
import React, { useState } from 'react'
import DinoDialog, { DinoDialogContent } from '../../../../components/dialogs/dino_dialog'
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
          margin='dense'
          required
          fullWidth
          label={language.data.FORM_QUESTION}
          type='name'
          helperText={errorQuestion && language.data.EMPTY_FIELD_ERROR}
          value={item.question}
          onChange={(e) => setItem({ ...item, question: e.target.value })}
          error={errorQuestion}
        />
        <TextField
          margin='dense'
          required
          fullWidth
          multiline
          rows={7}
          label={'Answer'}
          type='name'
          helperText={errorAnswer && language.data.EMPTY_FIELD_ERROR}
          value={item.answer}
          onChange={(e) => setItem({ ...item, answer: e.target.value })}
          error={errorAnswer}
        />
      </DinoDialogContent>
    </DinoDialog>
  )
}

export default FaqItemForm