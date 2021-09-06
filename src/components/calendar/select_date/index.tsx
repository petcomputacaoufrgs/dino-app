import React, { useState } from 'react'
import { InputLabel, MenuItem, Select } from '@material-ui/core'
import { useLanguage } from '../../../context/language'
import { EventView } from '../../../types/calendar/view/CalendarView'
import './styles.css'

interface SelectDateProps{
	item?: EventView 
}

const SelectDate: React.FC<SelectDateProps> = (props) => {
	const language = useLanguage()

	const dayList = Array.from({ length: 31 }, (_, i) => `${i + 1}`)
	const monthList = [
		language.data.JANUARY,
		language.data.FEBRUARY,
		language.data.MARCH,
		language.data.APRIL,
		language.data.MAY,
		language.data.JUNE,
		language.data.JULY,
		language.data.AUGUST,
		language.data.SEPTEMBER,
		language.data.OCTOBER,
		language.data.NOVEMBER,
		language.data.DECEMBER,
	]
	const yearList = ['2021', '2022', '2023', '2024', '2025']

	const [selectedDay, setSelectedDay] = useState(props.item?.event.date.getDate() || '')
	const [selectedMonth, setSelectedMonth] = useState(props.item? monthList[props.item?.event.date.getMonth()] : '')
	const [selectedYear, setSelectedYear] = useState(props.item?.event.date.getFullYear() || '')

	return (
		<div>
			<div className='date__selector'>
				<InputLabel shrink>{language.data.EVENT_DATE_ICON_ALT}</InputLabel>
			</div>
			<div className='.container-fluid'>
				<div className='row'>
					<div className='col-3 day_date__selector'>
						<Select
							displayEmpty
							renderValue={() => selectedDay || language.data.DAY}
							onChange={e => setSelectedDay(e.target.value as string)}
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
							displayEmpty
							renderValue={() => selectedMonth || language.data.MONTH}
							onChange={e => setSelectedMonth(e.target.value as string)}
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
							displayEmpty
							renderValue={() => selectedYear || language.data.YEAR}
							onChange={e => setSelectedYear(e.target.value as string)}
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
