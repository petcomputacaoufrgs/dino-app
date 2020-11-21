import BaseDatabase from './BaseDatabase'
import DatabaseConstants from '../constants/database/DatabaseConstants'
import EventDoc from '../types/calendar/database/EventDoc'
import LogAppErrorService from '../services/log_app_error/LogAppErrorService'

const getId = (doc?: EventDoc) => new Date().getTime().toString()

const applyChanges = (origin: EventDoc, changed: EventDoc): EventDoc => {
  const newDoc: EventDoc = {
    ...origin,
    color: origin.color,
    description: origin.description,
    end_date: origin.end_date,
    external_id: origin.external_id,
    init_date: origin.init_date,
    name: origin.name,
    reminder_alarm_ms: origin.reminder_alarm_ms,
    type: origin.type,
  }

  return newDoc
}

class CalendarDatabase extends BaseDatabase<EventDoc> {
  constructor() {
    super(DatabaseConstants.CALENDAR, getId, applyChanges)

    this.db.createIndex({
      index: {
        fields: ['init_date', 'end_date'],
      },
    })
  }

  putAll = async (docs: EventDoc[]) => {
    let timestamp = getId()

    docs.forEach((doc) => {
      if (!this.hasValidId(doc)) {
        doc._id = timestamp.toString()
        timestamp = timestamp + 1
      }
    })

    try {
      await this.db.bulkDocs(docs)
    } catch (e) {
      LogAppErrorService.logError(e)
    }
  }

  getByDate = async (init_date: Date, end_date: Date): Promise<EventDoc[]> => {
    try {
      const findResponse = await this.db.find({
        selector: {
          $and: [
            {
              end_date: { $gte: end_date },
            },
            {
              init_date: { $lte: init_date },
            },
          ],
        },
        sort: ['init_date'],
      })

      findResponse.docs.forEach((event) => {
        event.init_date = new Date(event.init_date)
        event.end_date = new Date(event.end_date)
      })

      return findResponse.docs
    } catch (e) {
      LogAppErrorService.logError(e)
      return []
    }
  }
}

export default new CalendarDatabase()
