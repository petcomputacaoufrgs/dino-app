import React, { useState } from 'react'
import { InputLabel, MenuItem, Select } from '@material-ui/core'
import './styles.css'
import DateUtils from '../../../utils/DateUtils'

interface SelectTimeProps {
	timeLabel: string
	value: Date
	minValue?: Date
	onChange(date: Date): void
}

const SelectTime: React.FC<SelectTimeProps> = props => {
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

	const handleChangeHour = e => {
		props.value.setHours(Number(e.target.value))
		props.onChange(props.value)
	}

	const handleChangeMinute = e => {
		props.value.setMinutes(Number(e.target.value))
		props.onChange(props.value)
	}

	return (
		<div className='time__selector'>
			<div>
				<InputLabel shrink>{props.timeLabel}</InputLabel>
				<div className='drop_down__flex_row'>
					<div>
						<Select
							value={props.value.getHours()}
							displayEmpty
							onChange={handleChangeHour}
						>
							{hourList.map((option, index) => (
								<MenuItem key={index} value={option}>
									{option}
								</MenuItem>
							))}
						</Select>
					</div>
					<div>
						<Select
							value={props.value.getMinutes()}
							displayEmpty
							onChange={handleChangeMinute}
						>
							{minuteList.map((option, index) => (
								<MenuItem key={index} value={option}>
									{option}
								</MenuItem>
							))}
						</Select>
					</div>
				</div>
			</div>
		</div>
	)
}

export default SelectTime
