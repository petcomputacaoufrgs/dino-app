import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import SelectTreatmentProps from './props'
import { useLanguage } from '../../../context/language'
import './styles.css'

const SelectTreatment: React.FC<SelectTreatmentProps> = ({
	children,
	availableTreatments,
	setTreatment,
	treatment,
}) => {
	const language = useLanguage()
	const [open, setOpen] = useState(false)
	const [inputValue, setInputValue] = useState('')

	const renderChildren = () => {
		return children ? (
			<div className='select-treatment__children'>{children}</div>
		) : (
			<></>
		)
	}

	return (
		<>
			<Autocomplete
				className='select-treatment__autocomplete'
				open={open}
				onOpen={() => setOpen(true)}
				onClose={() => setOpen(false)}
				getOptionSelected={(option, value) => option === value}
				getOptionLabel={treatment => treatment || ''}
				options={availableTreatments.map(treatment => treatment.name)}
				noOptionsText={language.data.NO_TREATMENTS_AVAILABLE}
				inputValue={inputValue}
				onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
				value={treatment ? treatment.name : null}
				onChange={(event: any, newValue: string | null) => {
					if (newValue) {
						const entity = availableTreatments.find(
							treatment => treatment.name === newValue,
						)
						if (entity) {
							setTreatment(entity)
						}
					}
				}}
				renderInput={params => (
					<TextField
						{...params}
						label={language.data.SETTINGS_TREATMENT}
						variant='standard'
						InputProps={{
							...params.InputProps,
							endAdornment: <>{params.InputProps.endAdornment}</>,
						}}
					/>
				)}
			/>
			{renderChildren()}
		</>
	)
}

export default SelectTreatment
