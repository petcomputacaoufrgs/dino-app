import React from 'react'
import MonthProps from './props'
import Header from './header'
import Content from './content'
import './styles.css'

const Month: React.FC<MonthProps> = ({
	date,
	goToCurrentMonth,
	isCurrentMonth,
}) => {
	return (
		<div className='month'>
			<Header date={date} goToCurrentMonth={goToCurrentMonth} />
			<Content date={date} isCurrentMonth={isCurrentMonth} />
		</div>
	)
}

export default Month
