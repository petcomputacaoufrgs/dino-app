import React, { useState } from 'react'
import Month from './month'
import AddButton from './add_button'
import HorizontalPagination from '../../../components/horizontal_pagination'
import DateUtils from '../../../utils/DateUtils'
import './styles.css'

const Calendar: React.FC = () => {
  const [slideDate, setSlideDate] = useState(new Date())

  const handleSlideChange = (newSlide: number) => {
    if (newSlide > 2) {
      setSlideDate(DateUtils.getNextMonth(slideDate))
    } else {
      setSlideDate(DateUtils.getLastMonth(slideDate))
    }
  }

  const goToCurrentMonth = () => {
    setSlideDate(new Date())
  }

  return (
    <>
      <div className="calendar">
        <HorizontalPagination
          onSlideChange={handleSlideChange}
          initialSlide={2}
          fixInitialSlide={true}
          pages={[
            <Month
              date={DateUtils.getLastMonth(DateUtils.getLastMonth(slideDate))}
              goToCurrentMonth={goToCurrentMonth}
            />,
            <Month
              date={DateUtils.getLastMonth(slideDate)}
              goToCurrentMonth={goToCurrentMonth}
            />,
            <Month date={slideDate} goToCurrentMonth={goToCurrentMonth} />,
            <Month
              date={DateUtils.getNextMonth(slideDate)}
              goToCurrentMonth={goToCurrentMonth}
            />,
            <Month
              date={DateUtils.getNextMonth(DateUtils.getNextMonth(slideDate))}
              goToCurrentMonth={goToCurrentMonth}
            />,
          ]}
        />
      </div>
      <AddButton />
    </>
  )
}

export default Calendar
