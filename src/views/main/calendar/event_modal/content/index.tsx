import React from 'react'
import ContentProps from './props'
import './styles.css'
import DateUtils from '../../../../../utils/DateUtils'
import { useLanguage } from '../../../../../context_provider/app_settings'
import StringUtils from '../../../../../utils/StringUtils'

const Content: React.FC<ContentProps> = ({event}) => {
    const language = useLanguage().current

    const getHourString = (date: Date): string => {
        return `${StringUtils.toStringWithZeros(date.getHours(),2)}:${StringUtils.toStringWithZeros(date.getMinutes(), 2)}`
    }

    const renderDate = (): JSX.Element => {
        const isToday = DateUtils.isEqualDay(event.init_date, new Date())

        const day = isToday ? language.TODAY : DateUtils.getWeekDayName(event.init_date.getDay(), language)

        return (
          <div className="calendar__event_modal__content__date_info">
            <p>
              {language.DATE_FROM}: {day},{' '}
              {DateUtils.getDateStringFormated(
                event.init_date.getTime(),
                language
              )}{' '}
              - {getHourString(event.init_date)}
            </p>
            <p>
              {language.DATE_TO}: {day},{' '}
              {DateUtils.getDateStringFormated(
                event.end_date.getTime(),
                language
              )}{' '}
              - {getHourString(event.end_date)}
            </p>
          </div>
        )
    }

    return (
      <div className="calendar__event_modal__content">
        {renderDate()}
      </div>
    )
}

export default Content