import React, { useState } from 'react'
import { InputLabel, MenuItem, Select } from '@material-ui/core'
import { useLanguage } from '../../../context/language'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import './styles.css'

interface SelectTimeProps {
	timeLabel: string
	value: Date
	minValue?: Date
	onChange(date: Date): void
}

const SelectTime: React.FC<SelectTimeProps> = props => {
	const language = useLanguage()
	const diffHours = props.minValue ? props.minValue.getHours() : 0
	const diffMinutes = props.minValue ? props.minValue.getMinutes() : 0

	const [hourInput, setHourInput] = useState('')
	const [minuteInput, setMinuteInput] = useState('')

	const hourList = Array.from(
		{ length: 24 - diffHours },
		(_, i) => `${i + diffHours}`,
	)

	const minuteList = Array.from(
		{ length: 60 - diffMinutes },
		(_, i) => `${i + diffMinutes}`,
	)

	const handleChangeHour = e => {
		if(e.target.value){
			props.value.setHours(Number(e.target.value))
			props.onChange(props.value)
		}
	}

	const handleChangeMinute = e => {
		if(e.target.value){
			props.value.setMinutes(Number(e.target.value))
			props.onChange(props.value)
		}
	}

	return (
		<div className='time__selector'>
			<div className='container-fluid padding_adjustment'>
				<InputLabel shrink>{props.timeLabel}</InputLabel>
				<div className='row'>
					<div className='col-6 padding_adjustment'>
						<Autocomplete
							value={hourInput}
							disableClearable
							onInputChange={(event, newInputValue) => setHourInput(newInputValue)}
							options={hourList}
							onChange={handleChangeHour}
							renderInput={params => (
								<TextField
									{...params}
									label={language.data.HOUR}
									variant='standard'
									InputProps={{
										...params.InputProps,
										endAdornment: <>{params.InputProps.endAdornment}</>,
									}}
								/>
							)}
						/>
					</div>
					<div className='col-6 padding_adjustment'>
						<Autocomplete
							value={minuteInput}
							disableClearable
							onInputChange={(event, newInputValue) => setMinuteInput(newInputValue)}
							options={minuteList}
							noOptionsText={''}
							onChange={handleChangeMinute}
							renderInput={params => (
								<TextField
									{...params}
									label={language.data.MINUTE}
									variant='standard'
									InputProps={{
										...params.InputProps,
										endAdornment: <>{params.InputProps.endAdornment}</>,
									}}
								/>
							)}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default SelectTime
