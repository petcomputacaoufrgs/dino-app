import React, { useEffect, useState } from 'react'
import DinoLoader from '../../../components/loader'
import MuiSearchBar from '../../../components/mui_search_bar'
import { useLanguage } from '../../../context/language'
import TreatmentService from '../../../services/treatment/TreatmentService'
import StringUtils from '../../../utils/StringUtils'
import TreatmentEntity from '../../../types/treatment/database/TreatmentEntity'
import TreatmentItems from './treatment_list_items'
import AddButton from '../../../components/button/circular_button/add_button'
import TreatmentForm from './treatment_form'
import './styles.css'
import TreatmentQuestionView from '../../../types/faq/view/TreatmentQuestionView'
import TreatmentQuestionService from '../../../services/faq/TreatmentQuestionService'

interface TreatmentProps {
	ref: React.Ref<unknown>,
}

const Treatment: React.FC<TreatmentProps> = () => {

	const language = useLanguage()

	const [isLoading, setIsLoading] = useState(true)
	const [treatments, setTreatments] = useState<Array<TreatmentEntity>>([])
	const [toAdd, setToAdd] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const [treatmentQuestionsView, setTreatmentQuestionsView] = useState<TreatmentQuestionView[]>()
	
	const filteredTreatments = treatments.filter(e => StringUtils.contains(e.name, searchTerm))

	useEffect(() => {
		const loadData = async () => {
			updateTreatments(await TreatmentService.getAll())
			// const treatmentQuestions = await TreatmentQuestionService.getAll()
			// const treatmentQuestionsView = treatmentQuestions.reduce((acum, tq) => {
			// 	const localId = tq.localTreatmentId
			// 	if(localId) {
			// 		// acum[localId].numberOfQuestions = acum[localId].numberOfQuestions! + 1 || 0
			// 		if(acum[localId]) {
			// 			acum[localId].treatmentQuestions.push(tq)
			// 			acum[localId].numberOfQuestions++
			// 		} else {
			// 			acum[localId] = {
			// 				treatmentQuestions: [tq],
			// 				numberOfQuestions: 1,
			// 			}
			// 		}
			// 	}
			// 	return acum
			// }, [] as TreatmentQuestionView[])
			
			// setTreatmentQuestionsView([...treatmentQuestionsView])

			finishLoading()
		}

		TreatmentService.addUpdateEventListenner(loadData)

		let updateTreatments = (data: TreatmentEntity[]) => {
			setTreatments(data)
		}

		let finishLoading = () => {
			setIsLoading(false)
		}

		if (isLoading) {
			loadData()
		}

		return () => {
			updateTreatments = () => {}
			finishLoading = () => {}
			TreatmentService.removeUpdateEventListenner(loadData)
		}
	}, [isLoading])

	const handleChange = (event: React.ChangeEvent<{ value: string }>) => {
		setSearchTerm(event.target.value)
  }
  
	const handleClose = () => {
		setToAdd(false)
	}

	return (
		<div className='treatments'>
			<DinoLoader className='treatments__loader' isLoading={isLoading}>
				<MuiSearchBar
					value={searchTerm}
					onChange={handleChange}
				/>
				<TreatmentItems items={filteredTreatments} />
				<AddButton
					handleAdd={() => setToAdd(true)}
					label={language.data.ADD_TREATMENT}
				/>
			</DinoLoader>
			<TreatmentForm open={toAdd} onClose={handleClose} />
		</div>
	)
}

export default Treatment