import { TextField } from '@material-ui/core'
import React, { useState } from 'react'
import DinoDialog, { DinoDialogHeader } from '../../../../components/dialogs/dino_dialog'
import { useLanguage } from '../../../../context/language'
import TreatmentService from '../../../../services/treatment/TreatmentService'
import TreatmentEntity from '../../../../types/treatment/database/TreatmentEntity'
import StringUtils from '../../../../utils/StringUtils'

interface TreatmentFormProps {
  open: boolean, 
  onClose: () => void,
  treatment?: TreatmentEntity
}

const TreatmentForm: React.FC<TreatmentFormProps> = ({ open, onClose, treatment }) => {

  const [item, setItem] = useState(treatment || { name: '' })
  const [error, setError] = useState(false)
	const language = useLanguage()

  const handleSave = () => {
		if(!StringUtils.isEmpty(item.name)) {
			TreatmentService.save(item)
			handleClose()
		} else {
			setError(true)
		}
	}	

  const handleClose = () => {
    onClose()
		setError(false)
  }
 
  return (
    <div className='treatment__dialog_form__content'>
      <DinoDialog 
        open={open}
        handleSave={handleSave}
        handleClose={handleClose}
        header={
          <DinoDialogHeader>
            {language.data.STAFF_ADD_TREATMENT}
          </DinoDialogHeader>
        }
      >
        <div className='treatment__dialog_form__content__textfield'>
          <TextField
            margin='dense'
            required
            fullWidth
            label={language.data.STAFF_ADD_TREATMENT_NAME}
            type='name'
            helperText={error && language.data.EMPTY_FIELD_ERROR}
            value={item.name}
            onChange={(e) => setItem({ ...item, name: e.target.value })}
            error={error}
            />
        </div>
      </DinoDialog>
    </div>
  )
}

export default TreatmentForm