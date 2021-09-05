import React from 'react'
import { EventView } from '../../../../types/calendar/view/CalendarView'
import './styles.css'

const CalendarEvent: React.FC<{
	item: EventView
	onClick: (item: EventView) => void
}> = ({ item, onClick }) => {
	return (
		<div
			style={{ backgroundColor: item.color }}
			className='event'
			onClick={() => onClick(item)}
		>
			<p className='event_title'>{item.event.title}</p>
			<p className='event_time'>{item.event.beginTime}</p>
		</div>
	)
}

export default CalendarEvent
