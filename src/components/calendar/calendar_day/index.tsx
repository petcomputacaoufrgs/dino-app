import React from 'react'
import { useLanguage } from '../../../context/language'
import CalendarEvent, { EventView } from '../calendar_event'
import './styles.css'

export interface DayView {
    dayOfMonth: string,
    dayOfWeek: string,
    events: EventView[],
}

const CalendarDay: React.FC<DayView> = ({
    dayOfMonth,
    dayOfWeek,
    events,
}) => {
    const language = useLanguage()

    return (
        <div className='day_wrapper dino__flex_row'>
            <div className="day_number_wrapper">
                <p className="week_day">{dayOfWeek}</p>
                <p className="month_day">{dayOfMonth}</p>
            </div>
            <div className="day_event_list_wrapper">
                {events.length === 0 ?
                    <div className="empty_event_list">
                        <p>{language.data.EMPTY_EVENT_LIST}</p>
                    </div> :
                    events.map(e => (
                        <div className="day_event_wrapper">
                            <CalendarEvent item={e} />
                        </div>
                    ))}
            </div>
        </div>
    )
}

export default CalendarDay