import React from 'react'
import { EventView } from '../../../../types/calendar/view/CalendarView'
import DateUtils from '../../../../utils/DateUtils'
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
			<p className='event_time'>
				{DateUtils.getTimeStringFormated(item.event.date, item.event.endTime)}
			</p>
		</div>
	)
}

export default CalendarEvent
