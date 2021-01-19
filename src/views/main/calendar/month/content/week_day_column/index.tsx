import React from 'react'
import WeekDayColumnProps from './props'
import Header from './header'
import Content from './content'
import './styles.css'

const WeekDayColumn: React.FC<WeekDayColumnProps> = ({
	shortName,
	first,
	days,
}) => {
	return (
		<div className='calendar__month__content__week_day_column'>
			<Header shortName={shortName} first={first} />
			<Content days={days} first={first} />
		</div>
	)
}

export default WeekDayColumn
