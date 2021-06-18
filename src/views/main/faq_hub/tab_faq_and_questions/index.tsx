import React, { useEffect, useState } from 'react'
import Faq from '../faq'
import { Badge } from '@material-ui/core'
import DinoTabPanel from '../../../../components/tab_panel'
import { useLanguage } from '../../../../context/language'
import ArrayUtils from '../../../../utils/ArrayUtils'
import TreatmentQuestionItems from '../treatment_question_list_items'
import { useParams } from 'react-router-dom'
import { HasStaffPowers } from '../../../../context/private_router'
import { useStaffData } from '../../../../context/staff_data'
import FaqItemService from '../../../../services/faq/FaqItemService'
import TreatmentQuestionService from '../../../../services/treatment/TreatmentQuestionService'
import TreatmentService from '../../../../services/treatment/TreatmentService'
import UserSettingsService from '../../../../services/user/UserSettingsService'
import FaqView from '../../../../types/faq/view/FaqView'
import TreatmentView from '../../../../types/faq/view/TreatmentView'
import TreatmentEntity from '../../../../types/treatment/database/TreatmentEntity'
import Utils from '../../../../utils/Utils'

const FaqAndUserQuestions: React.FC<{ view?: FaqView }> = ({ view }) => {
	const language = useLanguage()

	const { localId, tab } = useParams<{ localId?: string, tab?: string }>()

	const isStaff = HasStaffPowers()
	const staffData = useStaffData()

	const [isLoading, setIsLoading] = useState(true)
	const [treatmentView, setTreatmentView] = useState<TreatmentView>()


	useEffect(() => {
		const loadData = async () => {
			const treatments = await TreatmentService.getAll()
			if (Utils.isNotEmpty(localId)) {
				const currentTreatment = treatments.find(treatment => treatment.localId === Number(localId))
				updateTreatmentView(currentTreatment)
			} else await loadUserTreatment(treatments)

			finishLoading()
		}

		const loadUserTreatment = async (treatments: TreatmentEntity[]) => {
			const userSettings = await UserSettingsService.getFirst()
			if (userSettings && Utils.isNotEmpty(userSettings.treatmentLocalId)) {
				const currentTreatment = treatments.find(treatment => treatment.localId === userSettings.treatmentLocalId)
				updateTreatmentView(currentTreatment)
			} else {
				updateTreatmentView(undefined)
			}
		}

		let updateTreatmentView = (treatment?: TreatmentEntity) => {
			if (treatment) {
				const view = staffData.get(treatment.localId!)
				setTreatmentView(view)
			} else {
				setTreatmentView(undefined)
			}
		}

		let finishLoading = () => {
			setIsLoading(false)
		}

		UserSettingsService.addUpdateEventListenner(loadData)
		TreatmentService.addUpdateEventListenner(loadData)
		FaqItemService.addUpdateEventListenner(loadData)
		TreatmentQuestionService.addUpdateEventListenner(loadData)

		if (isLoading) {
			loadData()
		}

		return () => {
			updateTreatmentView = () => { }
			finishLoading = () => { }
			UserSettingsService.removeUpdateEventListenner(loadData)
			TreatmentService.removeUpdateEventListenner(loadData)
			FaqItemService.removeUpdateEventListenner(loadData)
			TreatmentQuestionService.removeUpdateEventListenner(loadData)
		}
	}, [isLoading, localId, staffData, isStaff])

	const panels = [
		{ Label: language.data.FAQ, Component: <Faq view={view} /> },
		{
			Label:
				<Badge
					color="secondary"
					variant="dot"
					invisible={ArrayUtils.isEmpty(treatmentView?.questions)}
				>
					{language.data.QUESTIONS}
				</Badge>,
			Component: <TreatmentQuestionItems />
		}
	]

	const intTab = tab ? parseInt(tab) : 0
	const currentTab = intTab >= 0 && intTab < panels.length ? intTab : 0

	return (
		<DinoTabPanel
			currentTab={currentTab}
			panels={panels}
		/>
	)
}

export default FaqAndUserQuestions