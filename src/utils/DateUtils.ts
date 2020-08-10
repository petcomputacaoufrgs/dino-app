import StringUtils from './StringUtils'
import { DateTime } from 'luxon'
import DinoAPIGeneralConstants from '../constants/dino_api/DinoAPIGeneralConstants'
import LanguageBase from '../types/languages/LanguageBase'
import moment from 'moment'

class DateUtils {
  
  getLastMonth = (date: Date): Date => {
    return moment(date).add(-1, 'M').startOf('month').toDate()
  }

  getNextMonth = (date: Date): Date => {
    return moment(date).add(1, 'M').startOf('month').toDate()
  }

  addMonth = (date: Date, diff: number): Date => {
    return moment(date).add(diff, 'M').startOf('month').toDate()
  }

  getDatetimeInMillis = (): number => {
    return DateTime.local()
      .setZone(DinoAPIGeneralConstants.DEFAULT_TIMEZONE)
      .toMillis()
  }

  getDateStringFormated = (dateMS: number, language: LanguageBase): string => {
    const date = new Date(dateMS)

    const stringDate = language.STRING_DATE_FORMAT

    const stringDay = StringUtils.toStringWithZeros(date.getDate(), 2)

    const stringMonth = this.getMonthName(date.getMonth(), language)

    const stringYear = date.getFullYear().toString()

    return stringDate
      .replace('DD', stringDay)
      .replace('MM', stringMonth)
      .replace('YYYY', stringYear)
  }

  getMonthName = (monthNumber: number, language: LanguageBase): string => {
    switch (monthNumber) {
      case 0:
        return language.JANUARY
      case 1:
        return language.FEBRUARY
      case 2:
        return language.MARCH
      case 3:
        return language.APRIL
      case 4:
        return language.MAY
      case 5:
        return language.JUNE
      case 6:
        return language.JULY
      case 7:
        return language.AUGUST
      case 8:
        return language.SEPTEMBER
      case 9:
        return language.OCTOBER
      case 10:
        return language.NOVEMBER
      case 11:
        return language.DECEMBER
      default:
        return language.INVALID_MONTH
    }
  }
}

export default new DateUtils()
