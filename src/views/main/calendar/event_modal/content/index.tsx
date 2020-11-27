import React from 'react'
import ContentProps from './props'
import DateUtils from '../../../../../utils/DateUtils'
import AlarmIcon from '@material-ui/icons/Alarm'
import EventIcon from '@material-ui/icons/Event'
import DescriptionIcon from '@material-ui/icons/Description'
import { useCurrentLanguage } from '../../../../../context/provider/app_settings'
import StringUtils from '../../../../../utils/StringUtils'
import CalendarService from '../../../../../services/calendar/CalendarService'
import './styles.css'

const Content: React.FC<ContentProps> = ({ event }) => {
  const language = useCurrentLanguage()

  const getHourString = (date: Date): string => {
    return `${StringUtils.toStringWithZeros(
      date.getHours(),
      2
    )}:${StringUtils.toStringWithZeros(date.getMinutes(), 2)}`
  }

  const getDaysBeforeString = (days: number): string =>
    `${days} ${days === 1 ? language.DAY : language.DAYS}`

  const getHoursBeforeString = (hours: number): string =>
    `${hours} ${hours === 1 ? language.HOUR : language.HOURS}`

  const getMinutesBeforeString = (minutes: number): string =>
    `${minutes} ${minutes === 1 ? language.MINUTE : language.MINUTES}`

  const getSeparator = (andCount: number): string =>
    andCount > 1 ? ', ' : ` ${language.AND} `

  const getEventAlarmString = (): string => {
    let finalString = ''

    let andCount = 0

    const difference = event.reminder_alarm_ms

    const differenceInMinutes = Math.round(difference / 60000)

    if (differenceInMinutes > 59) {
      const differenceInHours = Math.round(differenceInMinutes / 60)
      const minutes = differenceInMinutes % 60

      if (minutes > 0) {
        finalString = getMinutesBeforeString(minutes).concat(
          ` ${language.AND} `,
          finalString
        )

        andCount++
      }

      if (differenceInHours > 24) {
        const differenceInDays = Math.round(differenceInHours / 24)
        const hours = differenceInDays % 24

        if (hours > 0) {
          finalString = getHoursBeforeString(hours).concat(
            getSeparator(andCount),
            finalString
          )

          andCount++
        }

        finalString = getDaysBeforeString(differenceInDays).concat(
          getSeparator(andCount),
          finalString
        )

        andCount++
      } else {
        finalString = getHoursBeforeString(differenceInHours).concat(
          getSeparator(andCount),
          finalString
        )

        andCount++
      }
    } else {
      finalString = getMinutesBeforeString(differenceInMinutes)
    }

    const finalAnd = getSeparator(0)

    if (finalString.endsWith(finalAnd)) {
      finalString = finalString.substring(
        0,
        finalString.length - finalAnd.length
      )
    }

    const finalComma = getSeparator(2)

    if (finalString.endsWith(finalComma)) {
      finalString = finalString.substring(
        0,
        finalString.length - finalComma.length
      )
    }

    return `${finalString} ${language.BEFORE}`
  }

  const renderDate = (): JSX.Element => {
    const isToday = DateUtils.isEqualDay(event.init_date, new Date())

    const day = isToday
      ? language.TODAY
      : DateUtils.getWeekDayName(event.init_date.getDay(), language)

    return (
      <div className="calendar__event_modal__content__date_info">
        <p>
          {language.DATE_FROM}: {day},{' '}
          {DateUtils.getDateStringFormated(event.init_date.getTime(), language)}{' '}
          - {getHourString(event.init_date)}
        </p>
        <p>
          {language.DATE_TO}: {day},{' '}
          {DateUtils.getDateStringFormated(event.end_date.getTime(), language)}{' '}
          - {getHourString(event.end_date)}
        </p>
      </div>
    )
  }

  const renderAlarm = (): JSX.Element => (
    <div className="calendar__event_modal__content__data">
      <div className="calendar__event_modal__content__data__icon">
        <AlarmIcon fontSize="default" />
      </div>
      <p>{getEventAlarmString()}</p>
    </div>
  )

  const renderEventType = (): JSX.Element => (
    <div className="calendar__event_modal__content__data">
      <div className="calendar__event_modal__content__data__icon">
        <EventIcon fontSize="default" />
      </div>
      <p>{CalendarService.getEventTypeName(event.type, language)}</p>
    </div>
  )

  const renderDescription = (): JSX.Element => (
    <div className="calendar__event_modal__content__data description">
      <div className="calendar__event_modal__content__data__icon">
        <DescriptionIcon fontSize="default" />
      </div>
      <div className="calendar__event_modal__content__data__description">
        <p>{event.description}</p>
      </div>
    </div>
  )

  return (
    <div className="calendar__event_modal__content">
      {renderDate()}
      {renderAlarm()}
      {renderEventType()}
      {renderDescription()}
    </div>
  )
}

export default Content
