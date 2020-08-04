import StringUtils from './StringUtils'
import { DateTime } from 'luxon'
import DinoAPIGeneralConstants from '../constants/dino_api/DinoAPIGeneralConstants'
import LanguageBase from '../types/languages/LanguageBase'

class DateUtils {
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
      case 1:
        return language.JANUARY
      case 2:
        return language.FEBRUARY
      case 3:
        return language.MARCH
      case 4:
        return language.APRIL
      case 5:
        return language.MAY
      case 6:
        return language.JUNE
      case 7:
        return language.JULY
      case 8:
        return language.AUGUST
      case 9:
        return language.SEPTEMBER
      case 10:
        return language.OCTOBER
      case 11:
        return language.NOVEMBER
      case 12:
        return language.DECEMBER
      default:
        return language.INVALID_MONTH
    }
  }
}

export default new DateUtils()
