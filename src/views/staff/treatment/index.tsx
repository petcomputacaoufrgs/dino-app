import React, { useEffect, useState } from 'react'
import DinoLoader from '../../../components/loader'
import MuiSearchBar from '../../../components/mui_search_bar'
import { useLanguage } from '../../../context/language'
import TreatmentService from '../../../services/treatment/TreatmentService'
import StringUtils from '../../../utils/StringUtils'
import TreatmentEntity from '../../../types/treatment/database/TreatmentEntity'
import TreatmentItems from './treatment_items'
import './styles.css'
import AddButton from '../../../components/button/circular_button/add_button'
import TreatmentForm from './treatment_form'

interface TreatmentProps {
	ref: React.Ref<unknown>,
}

const Treatment: React.FC<TreatmentProps> = () => {

	const language = useLanguage()

	const [isLoading, setIsLoading] = useState(true)
	const [treatments, setTreatments] = useState<Array<TreatmentEntity>>([])
	const [add, setAdd] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	
	const filteredTreatments = treatments.filter(e => StringUtils.contains(e.name, searchTerm))

	useEffect(() => {
		const loadData = async () => {

			updateTreatments(await TreatmentService.getAll())
	
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
  
	const handleAdd = () => setAdd(true)

	const handleClose = () => {
		setAdd(false)
	}

	return (
		<div className='treatments'>
			<DinoLoader className='treatments__loader' isLoading={isLoading}>
				<MuiSearchBar
					value={searchTerm}
					onChange={handleChange}
					placeholder={language.data.SEARCH_HOLDER}
				/>
				<TreatmentItems items={filteredTreatments} />
				<AddButton
					handleAdd={handleAdd}
					label={language.data.NEW_CONTACT}
				/>
			</DinoLoader>
			<TreatmentForm open={add} onClose={handleClose} />
		</div>
	)
}

export default Treatment