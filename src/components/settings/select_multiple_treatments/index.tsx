import React, { useEffect, useState } from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import TreatmentService from '../../../services/treatment/TreatmentService'
import TreatmentEntity from '../../../types/treatment/database/TreatmentEntity'
import { FormControl, InputLabel, Select, Input } from '@material-ui/core'
import SelectMultipleTreatmentsProps from './props'
import Loader from '../../loader'
import './styles.css'

const SelectMultipleTreatments: React.FC<SelectMultipleTreatmentsProps> = ({
	selectedLocalIds,
	setSelectedLocalIds,
}) => {
	const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setSelectedLocalIds(event.target.value as number[])
	}

	const [isLoading, setIsLoading] = useState(true)
	const [treatments, setTreatments] = useState<TreatmentEntity[]>()

	useEffect(() => {
		const loadData = async () => {
			const treatments = await TreatmentService.getAll()
			setTreatments(treatments)
			finishLoading()
		}

		let finishLoading = () => {
			setIsLoading(false)
		}

		if (isLoading) {
			loadData()
		}

		return () => {
			finishLoading = () => {}
		}
	}, [isLoading])

	const renderOptions = () => {
		if (treatments && !isLoading) {
			return treatments.map(t => (
				<MenuItem key={t.name} value={t.localId}>
					{t.name}
				</MenuItem>
			))
		}
	}

	return (
		<div className='select_multiple_treatments'>
			<Loader isLoading={isLoading}>
				<FormControl style={{ marginTop: '6px', width: '100%' }}>
					<InputLabel id='select_multiple_treatments__input_label'>
						Tratamentos
					</InputLabel>
					<Select
						labelId='select_multiple_treatments__input_label'
						id='select_multiple_treatments__select_id'
						multiple
						fullWidth
						value={selectedLocalIds}
						onChange={handleChange}
						input={<Input />}
					>
						{renderOptions()}
					</Select>
				</FormControl>
			</Loader>
		</div>
	)
}

export default SelectMultipleTreatments
