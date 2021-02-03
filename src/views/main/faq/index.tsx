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

const Faq: React.FC = () => {
	const language = useLanguage()

	const [isLoading, setIsLoading] = useState(true)
	const [treatments, setTreatments] = useState<TreatmentEntity[]>([])

	const [treatmentView, setTreatmentView] = useState<TreatmentView | undefined>(undefined)
	const [dialogOpen, setDialogOpen] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const [searchResults, setSearchResults] = useState<TreatmentView | undefined>()

	useEffect(() => {
		const loadData = async () => {
			const treatments = await TreatmentService.getAll()
			const userSettings = await UserSettingsService.getFirst()

			if (userSettings && treatments) {
				const currentTreatment = treatments.find(
					treatment => treatment.localId === userSettings.treatmentLocalId,
				)
				if (currentTreatment) {
					const faqItems = await FaqItemService.getByTreatment(currentTreatment)
					updateTreatmentView(currentTreatment, faqItems)
				}
			}

			updateTreatments(treatments)
			finishLoading()
		}

		let updateTreatmentView = (treatment: TreatmentEntity, faqItems: FaqItemEntity[]) => {
			setTreatmentView({treatment, faqItems})
		}

		let updateTreatments = (treatments?: TreatmentEntity[]) => {
			setTreatments(treatments || [])
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
			updateTreatmentView = () => {}
			updateTreatments = () => {}
			finishLoading = () => {}
			TreatmentService.addUpdateEventListenner(loadData)
			FaqItemService.addUpdateEventListenner(loadData)
		}
	}, [isLoading])

	useEffect(() => {
		if (treatmentView) {
			const results = TreatmentService.getTreatmentViewByFilter(treatmentView.treatment, treatmentView.faqItems, searchTerm)
			setSearchResults(results)
		}
	}, [treatmentView, searchTerm])

	const handleChangeValueSearchTerm = (
		event: React.ChangeEvent<{ value: string }>,
	) => {
		setSearchTerm(event.target.value as string)
	}

	const handleSendQuestion = () => {
		setDialogOpen(true)
	}

	const renderNoFAQAvailable = () => {
		return (
			<div className='faq__fail_to_load'>
				<p>{language.data.NO_FAQ_AVAILABLE}</p>
			</div>
		)
	}

	return (
		<DinoLoader className='faq__loader' isLoading={isLoading} hideChildren>
			{searchResults ? (
				<>
					<MuiSearchBar
						value={searchTerm}
						onChange={handleChangeValueSearchTerm}
						placeholder={language.data.SEARCH_HOLDER}
					/>
					<div className='faq__content'>
						<FaqItems data={searchResults} />
						{treatmentView && (
							<>
								<LinkButton
									text={language.data.NOT_FOUND_QUESTION_FAQ}
									onClick={handleSendQuestion}
								/>
								<QuestionDialogForm
									treatment={treatmentView.treatment}
									dialogOpen={dialogOpen}
									setDialogOpen={setDialogOpen}
								/>
							</>
						)}
					</div>
				</>
			) : treatmentView ? renderNoFAQAvailable() : <NoTreatmentSelected treatments={treatments}/>
			}
		</DinoLoader>
	)
}

export default Faq
