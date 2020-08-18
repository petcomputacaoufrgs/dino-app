import BaseDatabase from "./BaseDatabase";
import DatabaseConstants from "../constants/DatabaseConstants";
import EventDoc from "../types/calendar/database/EventDoc";
import DatabaseDeleteWithoutID from "../error/DatabaseDeleteWithoutID";
import LogAppErrorService from "../services/log_app_error/LogAppErrorService";

class CalendarDatabase extends BaseDatabase<EventDoc> {
  constructor() {
    super(DatabaseConstants.CALENDAR)

    this.db.createIndex({
      index: {
        fields: ['init_date', 'end_date'],
      },
    })
  }

  put = async (doc: EventDoc) => {
    if (!doc._id) {
      doc._id = new Date().getTime().toString()
    }

    this.db.put(doc)
  }

  putAll = async (docs: EventDoc[]) => {
    let timestamp = new Date().getTime()

    docs.forEach((doc) => {
      if (!doc._id) {
        doc._id = timestamp.toString()
        timestamp = timestamp + 1
      }
    })

    this.db.bulkDocs(docs)
  }

  deleteByDoc = async (doc: EventDoc) => {
    try {
      if (doc._id && doc._rev) {
        const id = doc._id
        const rev = doc._rev

        this.db.remove(id, rev)
      } else {
        throw new DatabaseDeleteWithoutID(DatabaseConstants.NOTE, doc)
      }
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