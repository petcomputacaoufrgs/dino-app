import React, { useState, useEffect } from 'react'
import WeekDayPickerProps from './props'
import Weekday from '../../types/weekday_picker/Weekday'
import './styles.css'

const WeekDayPicker: React.FC<WeekDayPickerProps> = ({
	onWeekdayClick,
	week,
}) => {
	const [weekState, setWeekState] = useState(week)

	const getCircleClass = (weekday: Weekday) => {
		const baseClass = 'week_day_picker__weekday_circle__button'
		if (weekday.isSelected) {
			return baseClass.concat(' selected')
		}

		return baseClass
	}

	useEffect(() => {
		setWeekState(week)
	}, [week])

	return (
		<div className='week_day_picker'>
			{weekState.weekDays.map((weekday, index) => (
				<div
					role='checkbox'
					aria-checked={weekday.isSelected}
					className='week_day_picker__weekday_circle'
					key={index}
				>
					<button
						className={getCircleClass(weekday)}
						onClick={() => onWeekdayClick(weekday)}
					>
						{weekday.name}
					</button>
				</div>
			))}
		</div>
	)
}

export default WeekDayPicker
