import StringUtils from './StringUtils'
import LanguageBase from '../constants/languages/LanguageBase'
import moment from 'moment'

class DateUtils {
	convertDinoAPIStringDateToDate(date: string) {
		return new Date(date)
	}

	convertDateToDinoAPIStringDate(date: Date) {
		return date.toISOString()
	}

	getStartOfDay = (date: Date): Date => moment(date).startOf('day').toDate()

	getEndOfDay = (date: Date): Date => moment(date).endOf('day').toDate()

	isToday = (date: Date): boolean => this.isSameDay(date, new Date())

	isSameHour = (d1: Date, d2: Date): boolean =>
		d1.getHours() === d2.getHours() && this.isSameDay(d1, d2)

	isSameDay = (d1: Date, d2: Date): boolean =>
		d1.getDate() === d2.getDate() && this.isSameMonth(d1, d2)

	isSameMonth = (d1: Date, d2: Date): boolean =>
		d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()

	getLastMonth = (date: Date): Date => {
		return moment(date).add(-1, 'M').startOf('month').toDate()
	}

	getNextMonth = (date: Date): Date => {
		return moment(date).add(1, 'M').startOf('month').toDate()
	}

	getNextDay = (date: Date): Date => {
		return moment(date).add(1, 'day').startOf('day').toDate()
	}

	addMonth = (date: Date, diff: number): Date => {
		return moment(date).add(diff, 'M').startOf('month').toDate()
	}

	addMinute = (date: Date, diff: number): Date => {
		return moment(date).add(diff, 'minutes').toDate()
	}

	addHour = (date: Date, diff: number): Date => {
		return moment(date).add(diff, 'hours').toDate()
	}

	getDateStringFormated = (date: Date, language: LanguageBase): string => {
		const stringDate = language.STRING_DATE_FORMAT

		const stringDay = StringUtils.toStringWithZeros(date.getDate(), 2)

		const stringMonth = this.getMonthName(date.getMonth(), language)

		const stringYear = date.getFullYear().toString()

		return stringDate
			.replace('DD', stringDay)
			.replace('MM', stringMonth)
			.replace('YYYY', stringYear)
	}

	getExtendedDateStringFormated = (
		date: Date,
		language: LanguageBase,
	): string => {
		const weekDayName = this.getWeekDay(date.getDay(), language)
		const monthName = this.getMonthName(date.getMonth(), language)
		const stringDay = StringUtils.toStringWithZeros(date.getDate(), 2)
		return `${weekDayName}, ${stringDay} ${monthName} ${date.getFullYear()}`
	}

	getTimeStringFormated = (start: Date, end: Date): string => {
		const startTime =
			StringUtils.toStringWithZeros(start.getHours(), 2) +
			':' +
			StringUtils.toStringWithZeros(start.getMinutes(), 2)

		const endTime =
			StringUtils.toStringWithZeros(end.getHours(), 2) +
			':' +
			StringUtils.toStringWithZeros(end.getMinutes(), 2)

		return startTime.concat(' - ', endTime)
	}

	getMonthName = (monthNumber: number, language: LanguageBase): string => {
		const monthNames = [
			language.JANUARY,
			language.FEBRUARY,
			language.MARCH,
			language.APRIL,
			language.MAY,
			language.JUNE,
			language.JULY,
			language.AUGUST,
			language.SEPTEMBER,
			language.OCTOBER,
			language.NOVEMBER,
			language.DECEMBER,
		]
		const monthName: string | undefined = monthNames[monthNumber]
		return monthName || language.INVALID_MONTH
	}

	getMonthNames = (language: LanguageBase): string[] => {
		return [
			language.JANUARY,
			language.FEBRUARY,
			language.MARCH,
			language.APRIL,
			language.MAY,
			language.JUNE,
			language.JULY,
			language.AUGUST,
			language.SEPTEMBER,
			language.OCTOBER,
			language.NOVEMBER,
			language.DECEMBER,
		]
	}

	getWeekDayNamesAbrArray = (language: LanguageBase): string[] => {
		return [
			language.SUNDAY_ABREVIATION,
			language.MONDAY_ABREVIATION,
			language.TUESDAY_ABREVIATION,
			language.WEDNESDAY_ABREVIATION,
			language.THURSDAY_ABREVIATION,
			language.FRIDAY_ABREVIATION,
			language.SATURDAY_ABREVIATION,
		]
	}

	getWeekDay = (weekDayNumber: number, language: LanguageBase): string => {
		const weekDayNames = [
			language.SUNDAY_NAME,
			language.MONDAY_NAME,
			language.TUESDAY_NAME,
			language.WEDNESDAY_NAME,
			language.THURSDAY_NAME,
			language.FRIDAY_NAME,
			language.SATURDAY_NAME,
		]
		const weekDayName: string | undefined = weekDayNames[weekDayNumber]
		return weekDayName || language.INVALID_WEEKDAY
	}

	getMonthDaysLength = (monthNumber: number, yearNumber?: number) => {
		const monthDaysLength = [
			31,
			yearNumber && yearNumber % 4 === 0 ? 29 : 28,
			31,
			30,
			31,
			30,
			31,
			31,
			30,
			31,
			30,
			31,
		]
		const length: number | undefined = monthDaysLength[monthNumber]
		return length || 0
	}
}

export default new DateUtils()
