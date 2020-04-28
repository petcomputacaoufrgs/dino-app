import LanguageSet from '../language/LanguageSet'
import StringUtils from './StringUtils'

class DateUtils {

    getDateStringFormated = (day: number, month: number, year: number, language: LanguageSet): string => {
        const stringDate = language.STRING_DATE_FORMAT

        const stringDay = StringUtils.toStringWithZeros(day, 2)

        const stringMonth = this.getMonthName(month, language)

        const stringYear = year.toString()

        return stringDate.replace('DD', stringDay)
                        .replace('MM', stringMonth)
                        .replace('YYYY', stringYear)
    }

    getMonthName = (monthNumber: number, language: LanguageSet): string => {
        switch(monthNumber) {
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