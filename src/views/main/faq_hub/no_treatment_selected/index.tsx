import { Button } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import SelectTreatment from '../../../../components/settings/select_treatment'
import { useAlert } from '../../../../context/alert'
import { useLanguage } from '../../../../context/language'
import UserSettingsService from '../../../../services/user/UserSettingsService'
import TreatmentEntity from '../../../../types/treatment/database/TreatmentEntity'
import { ReactComponent as SaveSVG } from '../../../../assets/icons/general_use/save.svg'
import TreatmentService from '../../../../services/treatment/TreatmentService'
import NoFAQAvailable from '../no_faq_available'

const NoTreatmentSelected: React.FC = () => {

  const alert = useAlert()
  const language = useLanguage()
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTreatment, setSelectedTreatment] = useState<TreatmentEntity>()
  const [treatments, setTreatments] = useState<TreatmentEntity[]>()

  useEffect(() => {
		const loadData = async () => {
			const treatments = await TreatmentService.getAll()
			updateTreatments(treatments)
			finishLoading()
		} 

		let updateTreatments = (treatments: TreatmentEntity[]) => {
			setTreatments(treatments)
		}

		let finishLoading = () => {
			setIsLoading(false)
		}

		TreatmentService.addUpdateEventListenner(loadData)

		if (isLoading) {
			loadData()
		}

		return () => {
			updateTreatments = () => {}
			finishLoading = () => {}
			TreatmentService.removeUpdateEventListenner(loadData)
		}
	}, [isLoading])

  const handleSaveUserTreatment = async () => {

    const userSettings = await UserSettingsService.getFirst()
    
    if (userSettings) {
      if (selectedTreatment) {
        userSettings.treatmentLocalId = selectedTreatment.localId
        UserSettingsService.save(userSettings)
        alert.showSuccessAlert(language.data.SETTINGS_UPDATED_SUCESS)
      }
    } else {
      alert.showErrorAlert(language.data.SETTINGS_UPDATED_ERROR)
    }
  }

  return (
    treatments ? 
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
        {language.data.SAVE}
      </Button>
    </div>
    : <NoFAQAvailable />
  )
}

export default NoTreatmentSelected