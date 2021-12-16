import React, { useState, useEffect } from 'react'
import DayProps from './props'
import DayViewModel from '../../../../../../../../types/calendar/DayViewModel'
import DayModal from '../../../../../day_modal'
import CalendarService from '../../../../../../../../services/calendar/CalendarService'
import DateUtils from '../../../../../../../../utils/DateUtils'
import './styles.css'
import CalendarEventEntity from '../../../../../../../../types/calendar/database/CalendarEventEntity'

const Day: React.FC<DayProps> = ({ day }) => {
	const [dialogOpen, setDialogOpen] = useState(false)
	const [events, setEvents] = useState<CalendarEventEntity[]>([])
	const isToday = DateUtils.isToday(day.date)

	const getBoxClass = (): string =>
		`calendar__month__content__week_day_column__content__day__box__title__box ${
			isToday ? 'today' : ''
		}`

	const handleDayClick = (day: DayViewModel) => {
		setDialogOpen(true)
	}

	const handleClose = () => {
		setDialogOpen(false)
	}

	useEffect(() => {
		const findEvents = async () => {
			const events = await CalendarService.getEventByDate(day.date)
			updateEvents(events)
		}

		let updateEvents = (events: CalendarEventEntity[]) => {
			setEvents(events)
		}

		if (DateUtils.isToday(day.date) && events.length === 0) {
			findEvents()
		}

		const cleanBeforeUpdate = () => {
			updateEvents = (events: CalendarEventEntity[]) => {}
		}

		return cleanBeforeUpdate
	}, [day.date, events])

	return (
		<>
			<DayModal
				day={day}
				events={events}
				onClose={handleClose}
				open={dialogOpen}
			/>
			<button
				onClick={() => handleDayClick(day)}
				className='calendar__month__content__week_day_column__content__day'
			>
				<div className='calendar__month__content__week_day_column__content__day__box'>
					<div className='calendar__month__content__week_day_column__content__day__box__title'>
						<div className={getBoxClass()}>
							<h3>{day.date.getDate()}</h3>
						</div>
					</div>
					<div className='calendar__month__content__week_day_column__content__day__box__events'>
						{events.map((item, index) => (
							<div
								key={index}
								style={{ backgroundColor: item.color }}
								className='calendar__month__content__week_day_column__content__day__box__events__item'
							>
								<p>{item.name}</p>
							</div>
						))}
					</div>
				</div>
			</button>
		</>
	)
}

export default Day
