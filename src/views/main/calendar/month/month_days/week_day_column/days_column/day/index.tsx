import React, { useState } from 'react'
import DayProps from './props'
import './styles.css'
import DayViewModel from '../../../../../../../../types/calendar/DayViewModel'
import TransitionSlide from '../../../../../../../../components/slide_transition'
import { Dialog } from '@material-ui/core'

const Day: React.FC<DayProps> = ({ day }) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const getBoxClass = (): string => (
    `calendar__month__month_days__week_day_column__days_column__box__day__title__box ${day.isToday ? 'today' : ''}`
  )

  const handleDayClick = (day: DayViewModel) => {
    console.log("click")
    console.log(day.number)
    setDialogOpen(true)
  }

  const handleClose = () => {
    console.log("close")
    setDialogOpen(false)
  }

  const DayDialog = React.forwardRef((
    {children},
    ref: React.Ref<unknown>
  ): JSX.Element => {
    return (
      <Dialog
        ref={ref}
        open={dialogOpen}
        fullWidth
        onClose={handleClose}
        TransitionComponent={TransitionSlide}
        aria-labelledby="form-dialog"
      >
        Oi
      </Dialog>
    )
  })

  return (
    <>
      <DayDialog />
      <button onClick={() =>handleDayClick(day)} className="calendar__month__month_days__week_day_column__days_column__box">
        <div className="calendar__month__month_days__week_day_column__days_column__box__day">
          <div className="calendar__month__month_days__week_day_column__days_column__box__day__title">
            <div className={getBoxClass()}>
              <h3>{day.number}</h3>
            </div>
          </div>
          <div className="calendar__month__month_days__week_day_column__days_column__box__day__events">
            {day.events.map((item, index) => (
              <div key={index} style={{ backgroundColor: item.color }} className="calendar__month__month_days__week_day_column__days_column__box__day__events__item">
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
