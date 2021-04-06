import React, { useState, useEffect } from 'react'
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
import DinoTabPanel from '../../../components/tab_panel'
import TreatmentQuestionItems from './treatment_question_list_items'
import TreatmentQuestionService from '../../../services/treatment/TreatmentQuestionService'
import TreatmentView from '../../../types/faq/view/TreatmentView'
import { useStaffData } from '../../../context/staff_data'
import { Badge } from '@material-ui/core'
import Faq from './faq'
import ArrayUtils from '../../../utils/ArrayUtils'


const FaqHub: React.FC = () => {

	const { localId } = useParams<{ localId?: string }>()
	const language = useLanguage()
	const staff = IsStaff()
	const staffData = useStaffData()
	const [isLoading, setIsLoading] = useState(true)

	const [treatments, setTreatments] = useState<TreatmentEntity[]>()
	const [treatmentView, setTreatmentView] = useState<TreatmentView>()
	const [faqView, setFaqView] = useState<FaqView>()

	useEffect(() => {

		const loadData = async () => {
			if(localId) {
				const currentTreatment = await TreatmentService.getByLocalId(Number(localId))
				updateTreatmentView(currentTreatment)
				await updateFaqView(currentTreatment)
			} else await loadUserTreatment()

			finishLoading()
		} 

		const loadUserTreatment = async () => {
			const treatments = await TreatmentService.getAll()
			if(treatments.length > 0) {
				updateTreatments(treatments)
				const userSettings = await UserSettingsService.getFirst()
				if (userSettings) {
					const currentTreatment = treatments?.find(t => t.localId === userSettings.treatmentLocalId)
					updateTreatmentView(currentTreatment)
					await updateFaqView(currentTreatment)
				}
			}
		}

		let updateFaqView = async (treatment?: TreatmentEntity) => {
			if(treatment) {
				const faqItems = await FaqItemService.getByTreatment(treatment)
				setFaqView({treatment, faqItems})
			}
		}

		let updateTreatmentView = (treatment?: TreatmentEntity) => {
			if(treatment) {
				const view = staffData[treatment.localId!]
				setTreatmentView(view)
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
		TreatmentQuestionService.addUpdateEventListenner(loadData)

		if (isLoading) {
			loadData()
		}

		return () => {
			updateFaqView = async () => {}
			updateTreatments = () => {}
			updateTreatmentView = () => {}
			finishLoading = () => {}
			TreatmentService.removeUpdateEventListenner(loadData)
			FaqItemService.removeUpdateEventListenner(loadData)
			TreatmentQuestionService.removeUpdateEventListenner(loadData)
		}
	}, [isLoading, localId, staffData])

	const NoFAQAvailable = () => {
		return (
			<div className='faq__fail_to_load'>
				<p>{language.data.NO_FAQ_AVAILABLE}</p>
			</div>
		)
	}

	const FaqAndUserQuestions: React.FC = () => {
		return (		
				<DinoTabPanel 
					// currentTab={1} 
					panels={[ 
						{ Label: language.data.FAQ, Component: <Faq view={faqView}/> },
						{ 
							Label:  
								<Badge 
									color="secondary" 
									variant="dot"
									invisible={ArrayUtils.isEmpty(treatmentView?.questions)} 
								>
									{language.data.USERS_QUESTIONS}
								</Badge>, 
							Component: <TreatmentQuestionItems view={treatmentView} />
						}
					]}
				/> 
		)
	}

	return (
		<DinoLoader className='faq__loader' isLoading={isLoading} hideChildren>
			{faqView ? 
				<div className='faq__content'>
					{staff ? <FaqAndUserQuestions/> : <Faq view={faqView} />}
				</div>
			: treatments ? <NoTreatmentSelected treatments={treatments} /> : <NoFAQAvailable />
			}
		</DinoLoader>
	)
}

export default FaqHub
