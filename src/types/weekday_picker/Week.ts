import Weekday from './Weekday'
import LanguageBase from '../../constants/languages/LanguageBase'

export default class Week {
	weekDays: Weekday[]

	constructor(language: LanguageBase) {
		this.weekDays = [
			{
				isSelected: true,
				name: language.SUNDAY_NAME.substring(0, 1),
				index: 0,
			},
			{
				isSelected: true,
				name: language.MONDAY_NAME.substring(0, 1),
				index: 1,
			},
			{
				isSelected: true,
				name: language.TUESDAY_NAME.substring(0, 1),
				index: 2,
			},
			{
				isSelected: true,
				name: language.WEDNESDAY_NAME.substring(0, 1),
				index: 3,
			},
			{
				isSelected: true,
				name: language.THURSDAY_NAME.substring(0, 1),
				index: 4,
			},
			{
				isSelected: true,
				name: language.FRIDAY_NAME.substring(0, 1),
				index: 5,
			},
			{
				isSelected: true,
				name: language.SATURDAY_NAME.substring(0, 1),
				index: 6,
			},
		]
	}

	updateWeekdayByIndex = (index: number, isSelected: boolean) => {
		const weekday = this.weekDays.filter(weekday => weekday.index === index)[0]

		weekday.isSelected = isSelected
	}
}
