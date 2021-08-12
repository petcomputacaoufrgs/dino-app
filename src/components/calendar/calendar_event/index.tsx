import React from 'react'
import './styles.css'

export interface EventView {
    name: string,
    time: string,
    color: string,
}

const CalendarEvent: React.FC<{ item: EventView }> = ({ item }) => {
    return (
        <div style={{ backgroundColor: item.color }} className='event_wrapper'>
            <p className="event_title">{item.name}</p>
            <p className="event_time">{item.time}</p>
        </div>
    )
}

export default CalendarEvent