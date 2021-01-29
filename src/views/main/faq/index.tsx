import React, { useState, useEffect } from 'react'
import MuiSearchBar from '../../../components/mui_search_bar'
import FaqItems from './faq_items'
import QuestionDialogForm from './question_dialog_form'
import LinkButton from '../../../components/button/link_button'
import FaqView from '../../../types/faq/view/FaqView'
import { useLanguage } from '../../../context/language'
import TreatmentEntity from '../../../types/treatment/database/TreatmentEntity'
import TreatmentService from '../../../services/treatment/TreatmentService'
import UserSettingsService from '../../../services/user/UserSettingsService'
import FaqService from '../../../services/faq/FaqService'
import FaqItemService from '../../../services/faq/FaqItemService'
import Loader from '../../../components/loader'
import SelectTreatment from '../../../components/settings/select_treatment'
import Button from '../../../components/button'
import { ReactComponent as SaveSVG } from '../../../assets/icons/save.svg'
import UserSettingsEntity from '../../../types/user/database/UserSettingsEntity'
import { useAlert } from '../../../context/alert'
import FaqEntity from '../../../types/faq/database/FaqEntity'
import FaqItemEntity from '../../../types/faq/database/FaqItemEntity'
import './styles.css'

const Faq: React.FC = () => {
	const language = useLanguage()
	const alert = useAlert()

	const [isLoading, setIsLoading] = useState(true)
	const [settings, setSettings] = useState<UserSettingsEntity>()
	const [treatments, setTreatments] = useState<TreatmentEntity[]>()
	const [treatment, setTreatment] = useState<TreatmentEntity | undefined>(
		undefined,
	)

	const [faq, setFaq] = useState<FaqEntity | undefined>(undefined)
	const [faqItems, setFaqItems] = useState<FaqItemEntity[]>([])
	const [selectedTreatment, setSelectedTreatment] = useState<
		TreatmentEntity | undefined
	>(undefined)
	const [dialogOpen, setDialogOpen] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const [searchResults, setSearchResults] = useState<FaqView | undefined>()

	useEffect(() => {
		const loadData = async () => {
			const treatments = await TreatmentService.getAll()
			const userSettings = await UserSettingsService.getFirst()

			if (userSettings && treatments) {
				const currentTreatment = treatments.find(
					treatment => treatment.localId === userSettings.treatmentLocalId,
				)
				if (currentTreatment) {
					const faq = await FaqService.getByTreatment(currentTreatment)
					if (faq) {
						const faqItems = await FaqItemService.getByFaq(faq)
						updateFaq(faq, faqItems)
					}
				}
				updateTreatment(currentTreatment)
			}

			updateSettings(userSettings)
			updateTreatments(treatments)
			finishLoading()
		}

		let updateFaq = (faq: FaqEntity, faqItems: FaqItemEntity[]) => {
			setFaq(faq)
			setFaqItems(faqItems)
		}

		let updateTreatment = (treatment?: TreatmentEntity) => {
			setTreatment(treatment)
		}

		let updateSettings = (settings?: UserSettingsEntity) => {
			setSettings(settings)
		}

		let updateTreatments = (treatments?: TreatmentEntity[]) => {
			setTreatments(treatments)
		}

		let finishLoading = () => {
			setIsLoading(false)
		}

		UserSettingsService.addUpdateEventListenner(loadData)
		TreatmentService.addUpdateEventListenner(loadData)
		FaqService.addUpdateEventListenner(loadData)
		FaqItemService.addUpdateEventListenner(loadData)

		if (isLoading) {
			loadData()
		}

		return () => {
			updateFaq = () => {}
			updateTreatment = () => {}
			updateSettings = () => {}
			updateTreatments = () => {}
			finishLoading = () => {}
			UserSettingsService.addUpdateEventListenner(loadData)
			TreatmentService.addUpdateEventListenner(loadData)
			FaqService.addUpdateEventListenner(loadData)
			FaqItemService.addUpdateEventListenner(loadData)
		}
	}, [isLoading])

	useEffect(() => {
		if (faq) {
			const results = FaqService.getFaqViewByFilter(faq, faqItems, searchTerm)
			setSearchResults(results)
		}
	}, [faq, faqItems, searchTerm])

	const handleChangeValueSearchTerm = (
		event: React.ChangeEvent<{ value: string }>,
	) => {
		setSearchTerm(event.target.value as string)
	}

	const handleSendQuestion = () => {
		setDialogOpen(true)
	}

	const handleSaveTreatment = () => {
		if (settings) {
			if (selectedTreatment) {
				settings.treatmentLocalId = selectedTreatment.localId
				UserSettingsService.save(settings)
				alert.showSuccessAlert(language.data.SETTINGS_SAVE_SUCCESS)
			}
		} else {
			alert.showErrorAlert(language.data.SETTINGS_SAVE_ERROR)
		}
	}

	return (
		<Loader className='faq__loader' isLoading={isLoading} hideChildren>
			{searchResults ? (
				<>
					<MuiSearchBar
						value={searchTerm}
						onChange={handleChangeValueSearchTerm}
						placeholder={language.data.SEARCH_HOLDER}
					/>
					<div className='faq__content'>
						<FaqItems data={searchResults} />
						{faq && (
							<>
								<LinkButton
									text={language.data.NOT_FOUND_QUESTION_FAQ}
									onClick={handleSendQuestion}
								/>
								<QuestionDialogForm
									faq={faq}
									dialogOpen={dialogOpen}
									setDialogOpen={setDialogOpen}
								/>
							</>
						)}
					</div>
				</>
			) : (
				<>
					{treatment ? (
						<div className='faq__fail_to_load'>
							<p>{language.data.NO_FAQ_AVAILABLE}</p>
						</div>
					) : (
						<div className='faq__fail_to_load'>
							<p>{language.data.NO_TREATMENT_SELECTED}</p>
							<SelectTreatment
								availableTreatments={treatments || []}
								setTreatment={setSelectedTreatment}
								treatment={selectedTreatment}
							/>
							<Button
								className='faq__save_button'
								onClick={handleSaveTreatment}
							>
								<SaveSVG className='save_button__icon' />
								{language.data.TREATMENT_SAVE}
							</Button>
						</div>
					)}
				</>
			)}
		</Loader>
	)
}

export default Faq
