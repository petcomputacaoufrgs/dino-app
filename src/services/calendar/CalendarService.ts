import LanguageBase from '../../constants/languages/LanguageBase'
import DateUtils from '../../utils/DateUtils'
import CalendarEventEntity from '../../types/calendar/database/CalendarEventEntity'
import AuthenticatedService from '../auth/AuthenticatedService'
import Database from '../../storage/database/Database'

class CalendarService extends AuthenticatedService {
  private table: Dexie.Table<CalendarEventEntity, number>

  constructor() {
    super()
    this.table = Database.calendarEvent
  }

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
    const initDate = DateUtils.getStartOfDay(date)
    const endDate = DateUtils.getEndOfDay(date)
    const calendarEvents = await this.table
    .where('init_date')
    .aboveOrEqual(initDate)
    .and((event) => event.end_date <= endDate)
    .toArray()

    return calendarEvents
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

    this.saveAll(calendarEvents)
  }

  onLogout = async () => {
    return this.deleteAll()
  }

  private saveAll = async (entities: CalendarEventEntity[]) => {
    const ids = await Database.transaction('readwrite', this.table, () =>
      Promise.all(entities.map((entity) => this.table.put(entity)))
    )

    entities.forEach((entity, index) => (entity.id = ids[index]))
  }

  private deleteAll = async() => {
    return this.table.clear()
  }
}

export default new CalendarService()
