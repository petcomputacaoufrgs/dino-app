import LanguageBase from '../../constants/languages/LanguageBase'
import DateUtils from '../../utils/DateUtils'
import CalendarEventEntity from '../../types/calendar/database/CalendarEventEntity'
import CalendarEventRepository from '../../storage/database/calendar/CalendarEventRepository'

class CalendarService {
  getEventTypeName = (type: number, language: LanguageBase) => {
    switch (type) {
      case 0:
        return language.MEDICAL_APPOINTMENT_TYPE
      case 1:
        return language.MEDICINE_TYPE
      default:
        return language.INVALID_EVENT_TYPE
    }
  }

  getEventRepeatTypeName = (type: number, language: LanguageBase) => {
    switch (type) {
      case 0:
        return language.EVENT_REPEAT_NOT_REPEAT
      case 1:
        return language.EVENT_REPEAT_EVERY_DAY
      case 2:
        return language.EVENT_REPEAT_EVERY_WEEK
      case 3:
        return language.EVENT_REPEAT_EVERY_MONTH
      case 4:
        return language.EVENT_REPEAT_EVERY_YEAR
      case 5:
        return language.EVENT_REPEAT_EVERY_CUSTOMIZED
      default:
        return language.INVALID_EVENT_REPEAT_TYPE
    }
  }

  getEventByDate = async (date: Date): Promise<CalendarEventEntity[]> => {
    return CalendarEventRepository.getByDate(
      DateUtils.getStartOfDay(date),
      DateUtils.getEndOfDay(date)
    )
  }

  addMocks = async () => {
    const calendarEvents: CalendarEventEntity[] = [
      {
        color: '#4785E6',
        name: 'Consulta Oftalmo',
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic.",
        init_date: new Date(new Date().getTime() - 7200000),
        end_date: new Date(new Date().getTime()),
        reminder_alarm_ms: 9200000,
        type: 0,
      },
    ]

    CalendarEventRepository.putAll(calendarEvents)
  }

  removeUserData = () => {
    CalendarEventRepository.deleteAll()
  }
}

export default new CalendarService()
