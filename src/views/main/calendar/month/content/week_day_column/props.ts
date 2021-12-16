import DayViewModel from '../../../../../../types/calendar/DayViewModel'

export default interface WeekDayColumnProps {
	shortName: string
	first?: boolean
	days: DayViewModel[]
}
