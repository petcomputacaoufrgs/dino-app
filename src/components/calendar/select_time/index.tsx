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

	const hourList = Array.from(
		{ length: 24 - diffHours },
		(_, i) => `${i + diffHours}`,
	)

	const minuteList = Array.from(
		{ length: 60 - diffMinutes },
		(_, i) => `${i + diffMinutes}`,
	)

	const handleChangeHour = (value: string) => {
		props.value.setHours(Number(value))
		props.onChange(props.value)
	}

	const handleChangeMinute = (value: string) => {
		props.value.setMinutes(Number(value))
		props.onChange(props.value)
	}

	console.log(props.value.getHours().toString())

	return (
		<div className='time__selector'>
			<InputLabel margin='dense' shrink>
				{props.timeLabel}
			</InputLabel>
			<div className='time__wrapper dino__flex_row'>
				<Autocomplete
					value={props.value.getHours().toString()}
					disableClearable
					onInputChange={(event, newInputValue) => {
						if (newInputValue) {
							const entity = hourList.find(value => value === newInputValue)
							if (entity) handleChangeHour(entity)
						}
					}}
					options={hourList}
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
				<Autocomplete
					value={props.value.getMinutes().toString()}
					disableClearable
					onInputChange={(event, newInputValue) => {
						if (newInputValue) {
							const entity = minuteList.find(value => value === newInputValue)
							if (entity) handleChangeMinute(entity)
						}
					}}
					options={minuteList}
					noOptionsText={''}
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
	)
}

export default SelectTime
