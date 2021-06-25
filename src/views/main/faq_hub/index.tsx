import React, { useState, useEffect } from 'react'
import TreatmentEntity from '../../../types/treatment/database/TreatmentEntity'
import TreatmentService from '../../../services/treatment/TreatmentService'
import UserSettingsService from '../../../services/user/UserSettingsService'
import FaqItemService from '../../../services/faq/FaqItemService'
import DinoLoader from '../../../components/loader'
import NoTreatmentSelected from './no_treatment_selected'
import FaqView from '../../../types/faq/view/FaqView'
import { useParams } from 'react-router-dom'
import { HasStaffPowers } from '../../../context/private_router'
import Faq from './faq'
import Utils from '../../../utils/Utils'
import './styles.css'
import FaqAndUserQuestions from './tab_faq_and_questions'
import FaqItemEntity from '../../../types/faq/database/FaqItemEntity'

const FaqHub: React.FC = () => {
	const { localId } = useParams<{ localId?: string, tab?: string }>()
	
	const isStaff = HasStaffPowers()

	const [isLoading, setIsLoading] = useState(true)
	const [faqView, setFaqView] = useState<FaqView>()

	useEffect(() => {
		const loadData = async () => {
			const treatments = await TreatmentService.getAll()
			Utils.isNotEmpty(localId) 
			?	await loadTreatmentById(treatments)
			:	await loadUserTreatment(treatments)
			
			finishLoading()
		} 

		const loadTreatmentById = async (treatments: TreatmentEntity[]) => {
			const treatment = treatments.find(treatment => treatment.localId === Number(localId))
			if (treatment) {
				await loadFaqItems(treatment)
				return
			}

			cleanFaqView()
		}

		const loadUserTreatment = async (treatments: TreatmentEntity[]) => {
			const userSettings = await UserSettingsService.getFirst()
			if (userSettings && Utils.isNotEmpty(userSettings.treatmentLocalId)) {
				const treatment = treatments.find(treatment => treatment.localId === userSettings.treatmentLocalId)
				if (treatment) {
					await loadFaqItems(treatment)
					return
				}
			} 

			cleanFaqView()
		}

		const loadFaqItems = async (treatment: TreatmentEntity) => {
			const faqItems = await FaqItemService.getByTreatment(treatment)
			updateFaqView(treatment, faqItems)
		}

		let updateFaqView = (treatment: TreatmentEntity, faqItems: FaqItemEntity[]) => {
			setFaqView({treatment, faqItems})
		}

		let cleanFaqView = () => {
			setFaqView(undefined)
		}

		let finishLoading = () => {
			setIsLoading(false)
		}

		UserSettingsService.addUpdateEventListenner(loadData)
		FaqItemService.addUpdateEventListenner(loadData)
		TreatmentService.addUpdateEventListenner(loadData)

		if (isLoading) {
			loadData()
		}

		return () => {
			updateFaqView = () => {}
			cleanFaqView = () => {}
			finishLoading = () => {}
			UserSettingsService.removeUpdateEventListenner(loadData)
			FaqItemService.removeUpdateEventListenner(loadData)
			TreatmentService.removeUpdateEventListenner(loadData)
		}
	}, [isLoading, localId])

	return (
		<DinoLoader className='faq__loader' isLoading={isLoading} hideChildren>
			{faqView 
			?	<div className='faq__content'>
					{ isStaff 
						? <FaqAndUserQuestions view={faqView}/> 
						: <Faq view={faqView} />}
				</div>
			: <NoTreatmentSelected />}
		</DinoLoader>
	)
}

export default FaqHub