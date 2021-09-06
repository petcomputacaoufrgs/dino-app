import React from 'react'
import { useLanguage } from '../../../../context/language'
import {
	DayView,
	EventView,
} from '../../../../types/calendar/view/CalendarView'
import CalendarEvent from '../calendar_event'
import './styles.css'

const CalendarDay: React.FC<{
	item: DayView
	onClickEvent: (item: EventView) => void
	onClickEmpty: (dayOfMonth: string) => void
}> = props => {
	const language = useLanguage()

	return (
		<div className='day_wrapper dino__flex_row'>
			<div className='day_number_wrapper'>
				<p className='week_day'>{props.item.dayOfWeek}</p>
				<p className='month_day'>{props.item.dayOfMonth}</p>
			</div>
			<div className='day_event_list_wrapper'>
				{props.item.events.length === 0 ? (
					<div
						className='empty_event_list'
						onClick={() => props.onClickEmpty(props.item.dayOfMonth)}
					>
						<p>{language.data.EMPTY_EVENT_LIST}</p>
					</div>
				) : (
					props.item.events.map((e, index) => (
						<CalendarEvent key={index} item={e} onClick={props.onClickEvent} />
					))
				)}
			</div>
		</div>
	)
}

export default CalendarDay