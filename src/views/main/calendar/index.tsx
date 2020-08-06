import React from 'react'
import Month from './month'
import AddButton from './add_button'
import './styles.css'
import HorizontalPagination from '../../../components/horizontal_pagination'

const Calendar: React.FC = () => {
  return (
    <>
      <div className="calendar">
        <HorizontalPagination
          pages={[
            <Month name={'Agosto'} year={2020} />,
            <Month name={'Setembro'} year={2020} />,
            <Month name={'Outubro'} year={2020} />,
          ]}
        />
      </div>
      <AddButton />
    </>
  )
}

export default Calendar
