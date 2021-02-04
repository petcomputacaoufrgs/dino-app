import React, { useState, useEffect } from 'react'
import MuiSearchBar from '../../../components/mui_search_bar'
import FaqItems from './faq_items'
import QuestionDialogForm from './question_dialog_form'
import LinkButton from '../../../components/button/link_button'
import TreatmentView from '../../../types/faq/view/FaqView'
import { useLanguage } from '../../../context/language'
import TreatmentEntity from '../../../types/treatment/database/TreatmentEntity'
import TreatmentService from '../../../services/treatment/TreatmentService'
import UserSettingsService from '../../../services/user/UserSettingsService'
import FaqItemService from '../../../services/faq/FaqItemService'
import DinoLoader from '../../../components/loader'
import FaqItemEntity from '../../../types/faq/database/FaqItemEntity'
import NoTreatmentSelected from './no_treatment_selected'
import './styles.css'
import { IsStaff } from '../../../context/private_router'
import HistoryService from '../../../services/history/HistoryService'
import PathConstants from '../../../constants/app/PathConstants'

const Faq: React.FC = () => {
	const staff = IsStaff()
	const language = useLanguage()
	const [isLoading, setIsLoading] = useState(true)
	const [treatments, setTreatments] = useState<TreatmentEntity[]>([])

	useEffect(() => {
		const loadData = async () => {
			const userSettings = await UserSettingsService.getFirst()
			const treatments = await TreatmentService.getAll()
			
			if (userSettings && treatments) {
				const currentTreatment = treatments.find(t => t.localId === userSettings.treatmentLocalId)
				if(currentTreatment) {
					HistoryService.push(`${staff ? 
						PathConstants.STAFF_FAQ : PathConstants.USER_FAQ}/${currentTreatment.localId}`)
				}
			}

			updateTreatments(treatments)
			finishLoading()
		}

		let updateTreatments = (treatments?: TreatmentEntity[]) => {
			setTreatments(treatments || [])
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
			TreatmentService.addUpdateEventListenner(loadData)
		}
	}, [isLoading])


	const NoFAQAvailable = () => {
		return (
			<div className='faq__fail_to_load'>
				<p>{language.data.NO_FAQ_AVAILABLE}</p>
			</div>
		)
	}

	return (
		<DinoLoader className='faq__loader' isLoading={isLoading} hideChildren>
			{treatments ? <NoTreatmentSelected treatments={treatments}/> : <NoFAQAvailable />}
		</DinoLoader>
	)
}

export default Faq
