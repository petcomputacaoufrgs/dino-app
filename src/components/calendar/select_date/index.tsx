import React, { useState } from 'react'
import { InputLabel, MenuItem, Select } from '@material-ui/core'
import { useLanguage } from '../../../context/language'
import './styles.css'
import DateUtils from '../../../utils/DateUtils'

interface SelectDateProps {
	value: Date
	onChange(date: Date): void
}

const SelectDate: React.FC<SelectDateProps> = props => {
	const language = useLanguage()

	const dayList = Array.from({ length: 31 }, (_, i) => `${i + 1}`)
	const monthList = DateUtils.getMonthNames(language.data)
	const yearList = ['2021', '2022', '2023', '2024', '2025']

	const handleChangeDay = e => {
		props.value.setDate(Number(e.target.value))
		props.onChange(props.value)
	}

	const handleChangeMonth = e => {
		props.value.setMonth(Number(e.target.value))
		props.onChange(props.value)
	}

	const handleChangeYear = e => {
		props.value.setMinutes(Number(e.target.value))
		props.onChange(props.value)
	}

	console.log(props.value)

	return (
		<div>
			<div className='date__selector'>
				<InputLabel shrink>{language.data.EVENT_DATE_ICON_ALT}</InputLabel>
			</div>
			<div className='.container-fluid'>
				<div className='row'>
					<div className='col-3 day_date__selector'>
						<Select
							value={props.value.getDate()}
							onChange={handleChangeDay}
							fullWidth
						>
							{dayList.map((option, index) => (
								<MenuItem key={index} value={option}>
									{option}
								</MenuItem>
							))}
						</Select>
					</div>
					<div className='col-5 month_date__selector'>
						<Select
							value={props.value.getMonth()}
							displayEmpty
							renderValue={() => monthList[props.value.getMonth()]}
							onChange={handleChangeMonth}
							fullWidth
						>
							{monthList.map((option, index) => (
								<MenuItem key={index} value={option}>
									{option}
								</MenuItem>
							))}
						</Select>
					</div>
					<div className='col-4 year_date__selector'>
						<Select
							value={props.value.getFullYear()}
							displayEmpty
							onChange={handleChangeYear}
							fullWidth
						>
							{yearList.map((option, index) => (
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

export default SelectDate
