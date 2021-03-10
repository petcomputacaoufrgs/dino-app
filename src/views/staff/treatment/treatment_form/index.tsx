import { TextField } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import DinoDialog, { DinoDialogHeader } from '../../../../components/dialogs/dino_dialog'
import { useLanguage } from '../../../../context/language'
import TreatmentService from '../../../../services/treatment/TreatmentService'
import TreatmentEntity from '../../../../types/treatment/database/TreatmentEntity'
import StringUtils from '../../../../utils/StringUtils'
import Constants from '../../../../constants/app_data/DataConstants'

interface TreatmentFormProps {
  open: boolean, 
  onClose: () => void,
  treatment?: TreatmentEntity
}

const TreatmentForm: React.FC<TreatmentFormProps> = ({ open, onClose, treatment }) => {

  const [item, setItem] = useState(treatment || { name: '' })
  const [error, setError] = useState<string>()
	const langData = useLanguage().data

  useEffect(() => {
    if(!open) 
      return setItem({ name: '' })
  }, [open])

  const handleSave = async () => {

    async function isValueValid() {

      if(!StringUtils.isEmpty(item.name)) {
        const alreadyExists = await TreatmentService.getByName(item.name)

        if(alreadyExists === undefined) {
          return true
        }
        setError(langData.itemAlreadyExists(langData.TREATMENT))
        return false
      }
      setError(langData.EMPTY_FIELD_ERROR)
      return false
    }

		if(await isValueValid()) {
			TreatmentService.save(item)
			handleClose()
		} 
	}	

  const handleClose = () => {
    onClose()
		setError(undefined)
  }
 
  return (
    <div className='treatment__dialog_form__content'>
      <DinoDialog 
        open={open}
        onSave={handleSave}
        onClose={handleClose}
        header={<DinoDialogHeader>{langData.ADD_TREATMENT}</DinoDialogHeader>}
      >
        <div className='treatment__dialog_form__content__textfield'>
          <TextField
            aria-labelledby={langData.STAFF_ADD_TREATMENT_NAME}
          	className='dino__textfield'
            margin='dense'
            required
            fullWidth
            label={langData.STAFF_ADD_TREATMENT_NAME}
            type='name'
            value={item.name}
            /* é importante descontruir o objeto ao atualizá-lo, mesmo com um único atributo, senão ele vira outro. */
            onChange={(e) => setItem({ ...item, name: e.target.value })}
            error={error !== undefined}
            inputProps={{ maxLength: Constants.TREATMENT.MAX }}
            helperText={error || `${item.name.length}/${Constants.TREATMENT.MAX}`}
            />
        </div>
      </DinoDialog>
    </div>
  )
}

export default TreatmentForm