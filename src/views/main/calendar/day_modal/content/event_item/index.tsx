import React, { useState } from 'react'
import EventItemProps from './props'
import DateUtils from '../../../../../../utils/DateUtils'
import EventModal from '../../../event_modal'
import './styles.css'

const EventItem: React.FC<EventItemProps> = ({
  day,
  event,
  totalEventsOnHour,
}) => {
  const [openDialog, setOpenDialog] = useState(false)

  const adjustEndDate = (end: Date) =>
    end.getDate() !== day.date.getDate() ? DateUtils.getEndOfDay(end) : end

  const minutes = event.init_date.getMinutes()
  const end = adjustEndDate(event.end_date)

  const hoursDuration = end.getHours() - event.init_date.getHours()
  const minutesDuration = end.getMinutes() - event.init_date.getMinutes()

  const handleClick = () => {
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
  }

  return (
    <>
      <div
        className="calendar__day__modal__hours__hours_list__line__events__event_item"
        onClick={handleClick}
        style={{
          width: `${100 / totalEventsOnHour}%`,
          backgroundColor: event.color,
          transform: `translate3d(0,${(40 / 60) * minutes}px,0)`,
          height: `${(40 / 60) * (hoursDuration * 60 + minutesDuration)}px`,
        }}
      >
        <p>{event.name}</p>
      </div>
      <EventModal event={event} onClose={handleClose} open={openDialog} />
    </>
  )
}

export default EventItem
