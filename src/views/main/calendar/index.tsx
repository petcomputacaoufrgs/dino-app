import React, { useState } from 'react'
import Month from './month'
import AddButton from './add_button'
import DateUtils from '../../../utils/DateUtils'
import HorizontalPagination from '../../../components/horizontal_pagination'
import './styles.css'

const HALF_MONTH_RANGE = 3
const UPDATE_MARGIN = 2

const Calendar: React.FC = () => {
  const [mainDate, setMainDate] = useState(new Date())
  const [slide, setSlide] = useState(HALF_MONTH_RANGE)

  const handleSlideChange = (newSlide: number) => {
    const indexBasedInMainSlide = newSlide - HALF_MONTH_RANGE

    if (indexBasedInMainSlide > UPDATE_MARGIN) {
      setMainDate(DateUtils.addMonth(mainDate, indexBasedInMainSlide))
      setSlide(HALF_MONTH_RANGE)
    } else if (indexBasedInMainSlide < UPDATE_MARGIN * -1) {
      setMainDate(DateUtils.addMonth(mainDate, indexBasedInMainSlide))
      setSlide(HALF_MONTH_RANGE)
    }
  }

  const getMonthElementList = (): React.FC[] => {
    const months: React.FC[] = []

    let start = HALF_MONTH_RANGE * -1

    while (start <= HALF_MONTH_RANGE) {
      months.push(getMonthElement(start))
      start++
    }

    return months
  }

  const getMonthElement = (diff: number): React.FC => () => {
    const date = DateUtils.addMonth(mainDate, diff)
    return (
      <Month
        date={date}
        goToCurrentMonth={goToCurrentMonth}
        isCurrentMonth={DateUtils.isEqualMonth(date, new Date())}
      />
    )
  }

  const goToCurrentMonth = () => {
    setMainDate(new Date())
    setSlide(HALF_MONTH_RANGE)
  }

  return (
    <>
      <div className="calendar">
        <HorizontalPagination
          onSlideChange={handleSlideChange}
          slide={slide}
          pages={getMonthElementList()}
        />
      </div>
      <AddButton />
    </>
  )
}

export default Calendar
