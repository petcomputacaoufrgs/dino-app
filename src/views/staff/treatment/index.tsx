import React, { useEffect, useState } from 'react'
import Loader from '../../../components/loader'
import MuiSearchBar from '../../../components/mui_search_bar'
import { useLanguage } from '../../../context/language'
import TreatmentService from '../../../services/treatment/TreatmentService'
import StringUtils from '../../../utils/StringUtils'
import TreatmentEntity from '../../../types/treatment/database/TreatmentEntity'
import TreatmentItems from './treatment_items'
import { TextField } from '@material-ui/core'
import './styles.css'
import DinoDialog, { DinoDialogHeader } from '../../../components/dialogs/dino_dialog'
import AddButton from '../../../components/button/circular_button/add_button'

interface TreatmentProps {
	ref: React.Ref<unknown>,
}

const Treatment: React.FC<TreatmentProps> = React.forwardRef(({ ref },) => {

	const language = useLanguage()

	const [value, setValue] = useState('')
	const [isLoading, setIsLoading] = useState(true)
	const [treatments, setTreatments] = useState<Array<TreatmentEntity>>([])
	const [add, setAdd] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const [error, setError] = useState(false)
	
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
		setValue('')
		setError(false)
		setAdd(false)
	}

	const handleSave = () => {
		if(!StringUtils.isEmpty(value)) {
			console.log(value)
			TreatmentService.save({ name: value })
			handleClose()
		} else {
			setError(true)
		}
	}

	const renderAddTreatment = () => {
		return (
			<div className='treatment__dialog_form__content'>
				<DinoDialog 
					open={add}
					handleSave={handleSave}
					handleClose={handleClose}
					header={
						<DinoDialogHeader>
							{language.data.STAFF_ADD_TREATMENT}
						</DinoDialogHeader>
					}
				>
					<div className='treatment__dialog_form__content__textfield'>
						<TextField
							margin='dense'
							required
							fullWidth
							label={language.data.STAFF_ADD_TREATMENT_NAME}
							type='name'
							helperText={error && language.data.EMPTY_FIELD_ERROR}
							value={value}
							onChange={(e) => setValue(e.target.value as string)}
							error={error}
							/>
					</div>
				</DinoDialog>
			</div>
		)
	}
	

	return (
		<div className='treatments'>
			<Loader className='treatments__loader' isLoading={isLoading}>
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
			</Loader>
			{renderAddTreatment()}
		</div>
	)
})

export default Treatment