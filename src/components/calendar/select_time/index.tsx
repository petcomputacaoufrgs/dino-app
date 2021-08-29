import React, { useState } from 'react'
import { InputLabel, MenuItem, Select } from '@material-ui/core'
import './styles.css'

interface SelectTimeProps {
	timeLabel: string
}

const SelectTime: React.FC<SelectTimeProps> = props => {
	const [hour, setHour] = useState<string>('')
	const [minute, setMinute] = useState<string>('')

	const hourList = Array.from({ length: 24 }, (_, i) => `${i}`)

	const minuteList = Array.from({ length: 60 }, (_, i) => `${i}`)

	return (
		<div className='time__selector'>
			<div>
				<InputLabel shrink>{props.timeLabel}</InputLabel>
				<div className='drop_down__flex_row'>
					<div>
						<Select
							value={hour}
							displayEmpty
							renderValue={() => hour || 'HH'}
							onChange={e => setHour(e.target.value as string)}
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
							value={minute}
							displayEmpty
							renderValue={() => minute || 'MM'}
							onChange={e => setMinute(e.target.value as string)}
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
