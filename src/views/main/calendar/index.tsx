import React, { useState } from 'react'
import Month from './month'
import AddButton from './add_button'
import HorizontalPagination from '../../../components/horizontal_pagination'
import DateUtils from '../../../utils/DateUtils'
import { PageInfo } from '../../../components/horizontal_pagination/props'
import './styles.css'

const Calendar: React.FC = () => {
  const [slideDate, setSlideDate] = useState(new Date())
  const [pageInfo, setPageInfo] = useState(new PageInfo(1))

  const handleSlideChange = (newSlide: number) => {
    if (newSlide > pageInfo.currentPage) {
      console.log(DateUtils.getNextMonth(slideDate))
      setSlideDate(DateUtils.getNextMonth(slideDate))
    } else {
      console.log(DateUtils.getLastMonth(slideDate))
      setSlideDate(DateUtils.getLastMonth(slideDate))
    }

    setPageInfo(new PageInfo(1))
  }

  const goToCurrentMonth = () => {
    setSlideDate(new Date())
    setPageInfo(new PageInfo(1))
  }

  return (
    <>
      <div className="calendar">
        <HorizontalPagination
          onSlideChange={handleSlideChange}
          info={pageInfo}
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
