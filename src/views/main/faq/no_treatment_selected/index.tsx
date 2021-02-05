import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import SelectTreatment from '../../../../components/settings/select_treatment'
import { useAlert } from '../../../../context/alert'
import { useLanguage } from '../../../../context/language'
import UserSettingsService from '../../../../services/user/UserSettingsService'
import TreatmentEntity from '../../../../types/treatment/database/TreatmentEntity'
import { ReactComponent as SaveSVG } from '../../../../assets/icons/save.svg'

interface NoTreatmentSelectedProps {
  treatments: TreatmentEntity[]
}

const NoTreatmentSelected: React.FC<NoTreatmentSelectedProps> = ({ treatments }) => {

  const alert = useAlert()
  const language = useLanguage()
  const [selectedTreatment, setSelectedTreatment] = useState<TreatmentEntity>()

  const handleSaveUserTreatment = async () => {

    const userSettings = await UserSettingsService.getFirst()
    
    if (userSettings) {
      if (selectedTreatment) {
        userSettings.treatmentLocalId = selectedTreatment.localId
        UserSettingsService.save(userSettings)
        alert.showSuccessAlert(language.data.SETTINGS_SAVE_SUCCESS)
      }
    } else {
      alert.showErrorAlert(language.data.SETTINGS_SAVE_ERROR)
    }
  }

  return (
    <div className='faq__fail_to_load'>
      <p>{language.data.NO_TREATMENT_SELECTED}</p>
      <SelectTreatment
        availableTreatments={treatments || []}
        treatment={selectedTreatment}
        setTreatment={setSelectedTreatment}
      />
      <Button
        className='faq__save_button'
        onClick={handleSaveUserTreatment}
      >
        <SaveSVG className='save_button__icon' />
        {language.data.TREATMENT_SAVE}
      </Button>
    </div>
  )
}

export default NoTreatmentSelected