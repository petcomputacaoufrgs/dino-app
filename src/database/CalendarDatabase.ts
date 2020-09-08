import BaseDatabase from "./BaseDatabase"
import DatabaseConstants from "../constants/DatabaseConstants"
import EventDoc from "../types/calendar/database/EventDoc"
import LogAppErrorService from "../services/log_app_error/LogAppErrorService"

const getId = (doc?: EventDoc) => new Date().getTime().toString()

class CalendarDatabase extends BaseDatabase<EventDoc> {
  constructor() {
    super(DatabaseConstants.CALENDAR, getId)

    this.db.createIndex({
      index: {
        fields: ['init_date', 'end_date'],
      },
    })
  }

  putAll = async (docs: EventDoc[]) => {
    let timestamp = getId()

    docs.forEach((doc) => {
      if (!doc._id) {
        doc._id = timestamp.toString()
        timestamp = timestamp + 1
      }
    })

    try {
      this.db.bulkDocs(docs)
    } catch (e) {
      LogAppErrorService.saveError(e)
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
      LogAppErrorService.saveError(e)
      return []
    }
  }
}

export default new CalendarDatabase()