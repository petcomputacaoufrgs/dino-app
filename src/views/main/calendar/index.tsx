import React, { useState } from 'react'
import Month from './month'
import AddButton from './add_button'
import HorizontalPagination from '../../../components/horizontal_pagination'
import DateUtils from '../../../utils/DateUtils'
import './styles.css'

const HALF_MONTH_RANGE = 20

const Calendar: React.FC = () => {
  const [mainDate, setMainDate] = useState(new Date())
  const [slide, setSlide] = useState(HALF_MONTH_RANGE)
  const [animate, setAnimate] = useState(false)

  const handleSlideChange = (newSlide: number) => {
    const indexBasedInMainSlide = newSlide - HALF_MONTH_RANGE

    if (animate) {
      setAnimate(false)
    }

    if (indexBasedInMainSlide > (HALF_MONTH_RANGE/2)) {
      setMainDate(DateUtils.addMonth(mainDate, indexBasedInMainSlide))
      setSlide(HALF_MONTH_RANGE)
    } else if (indexBasedInMainSlide < (HALF_MONTH_RANGE/2 * -1)){
      setMainDate(DateUtils.addMonth(mainDate, indexBasedInMainSlide))
      setSlide(HALF_MONTH_RANGE)
    } else {
      setSlide(newSlide)
    }
  }

  const getMonthElementList = () : JSX.Element[] => {
    const months: JSX.Element[] = []

    let start = HALF_MONTH_RANGE * -1

    while (start <= HALF_MONTH_RANGE) {
      months.push(getMonthElement(start))
      start++
    }

    return months
  }

  const getMonthElement = (diff: number): JSX.Element => (
    <Month
      date={DateUtils.addMonth(mainDate, diff)}
      goToCurrentMonth={goToCurrentMonth}
    />
  )

  const goToCurrentMonth = () => {
    setMainDate(new Date())
    setAnimate(true)
    setSlide(HALF_MONTH_RANGE)
  }

  return (
    <>
      <div className="calendar">
        <HorizontalPagination
          onSlideChange={handleSlideChange}
          slide={slide}
          dontAnimate={!animate}
          pages={getMonthElementList()}
        />
      </div>
      <AddButton />
    </>
  )
}

export default Calendar
