import React from 'react'
import { CalendarEventView } from '../../../types/calendar/view/CalendarView'
import './styles.css'

const CalendarEvent: React.FC<{ item: CalendarEventView }> = ({ item }) => {
	return (
		<div style={{ backgroundColor: item.color }} className='event_wrapper'>
			<p className='event_title'>{item.title}</p>
			<p className='event_time'>{item.time}</p>
		</div>
	)
}

export default CalendarEvent
