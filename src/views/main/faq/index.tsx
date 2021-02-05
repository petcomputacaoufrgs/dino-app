import React, { useState, useEffect } from 'react'
import MuiSearchBar from '../../../components/mui_search_bar'
import FaqItems from './faq_list_items'
import QuestionDialogForm from './question_dialog_form'
import LinkButton from '../../../components/button/link_button'
import { useLanguage } from '../../../context/language'
import TreatmentEntity from '../../../types/treatment/database/TreatmentEntity'
import TreatmentService from '../../../services/treatment/TreatmentService'
import UserSettingsService from '../../../services/user/UserSettingsService'
import FaqItemService from '../../../services/faq/FaqItemService'
import DinoLoader from '../../../components/loader'
import NoTreatmentSelected from './no_treatment_selected'
import './styles.css'
import FaqView from '../../../types/faq/view/FaqView'
import { useParams } from 'react-router-dom'
import { IsStaff } from '../../../context/private_router'

const Faq: React.FC = () => {

	const { localId } = useParams<{localId?: string}>()
	const language = useLanguage()
	const staff = IsStaff()

	const [isLoading, setIsLoading] = useState(true)
	const [treatments, setTreatments] = useState<TreatmentEntity[]>()
	const [dialogOpen, setDialogOpen] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')

	const [faqView, setFaqView] = useState<FaqView>()

	useEffect(() => {

		const loadUserTreatment = async () => {
			const treatments = await TreatmentService.getAll()
			if(treatments.length > 0) {
				updateTreatments(treatments)
				const userSettings = await UserSettingsService.getFirst()
				if (userSettings) {
					const currentTreatment = treatments?.find(t => t.localId === userSettings.treatmentLocalId)
					await updateFaqView(currentTreatment)
				}
			}
		}

		const loadData = async () => {
			if(localId) {
				const currentTreatment = await TreatmentService.getByLocalId(Number(localId))
				await updateFaqView(currentTreatment)
			} else await loadUserTreatment()
		
			finishLoading()
		} 

		let updateFaqView = async (treatment?: TreatmentEntity) => {
			if(treatment) {
				const faqItems = await FaqItemService.getByTreatment(treatment)
				setFaqView({treatment, faqItems})
			}
		}

		let updateTreatments = (treatments: TreatmentEntity[]) => {
			setTreatments(treatments)
		}

		let finishLoading = () => {
			setIsLoading(false)
		}

		TreatmentService.addUpdateEventListenner(loadData)
		FaqItemService.addUpdateEventListenner(loadData)

		if (isLoading) {
			loadData()
		}

		return () => {
			updateFaqView = async () => {}
			updateTreatments = () => {}
			finishLoading = () => {}
			TreatmentService.removeUpdateEventListenner(loadData)
			FaqItemService.removeUpdateEventListenner(loadData)
		}
	}, [isLoading, localId])

	const handleSendQuestion = () => {
		setDialogOpen(true)
	}

	const NoFAQAvailable = () => {
		return (
			<div className='faq__fail_to_load'>
				<p>{language.data.NO_FAQ_AVAILABLE}</p>
			</div>
		)
	}

	return (
		<DinoLoader className='faq__loader' isLoading={isLoading} hideChildren>
			{faqView ? (
				<>
					<MuiSearchBar
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value as string)}
						placeholder={language.data.SEARCH_HOLDER}
					/>
					<div className='faq__content'>
						<FaqItems data={TreatmentService.getFaqViewByFilter(faqView, searchTerm)} />
						{!staff && (
							<>
								<LinkButton
									text={language.data.NOT_FOUND_QUESTION_FAQ}
									onClick={handleSendQuestion}
								/>
								<QuestionDialogForm
									treatment={faqView.treatment}
									dialogOpen={dialogOpen}
									setDialogOpen={setDialogOpen}
								/>
							</>
						)}
					</div>
				</>
			) : treatments ? <NoTreatmentSelected treatments={treatments} /> : <NoFAQAvailable />
			}
		</DinoLoader>
	)
}

export default Faq
