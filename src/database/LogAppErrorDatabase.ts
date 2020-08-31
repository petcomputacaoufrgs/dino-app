import BaseDatabase from './BaseDatabase'
import DatabaseConstants from '../constants/DatabaseConstants'
import LogAppErrorDoc from '../types/log_app_error/database/LogAppErrorDoc'
import LogAppErrorService from '../services/log_app_error/LogAppErrorService'

class LogAppErrorDatabase extends BaseDatabase<LogAppErrorDoc> {
  constructor() {
    super(DatabaseConstants.LOG_APP_ERROR)
  }

  put = async (doc: LogAppErrorDoc) => {
    if (!doc._id) {
      doc._id = new Date().getTime().toString()
    }

    this.db.put(doc)
  }

  getAll = async (): Promise<LogAppErrorDoc[]> => {
    try {
      const responseIds = await this.db.allDocs()

      const ids = responseIds.rows
        .filter((row) => !row.value.deleted)
        .map((row) => row.id)

      const response = await this.db.allDocs({
        include_docs: true,
        keys: ids,
      })

      const logAppErrors = response.rows
        .map((r) => {
          const doc: any = r.doc

          if (doc) {
            return {
              _id: r.id,
              _rev: r.value.rev,
              error: doc.error,
              file: doc.file,
              title: doc.title,
              date: doc.date,
            } as LogAppErrorDoc
          }

          return null
        })
        .filter((log) => log !== null)

      return logAppErrors as LogAppErrorDoc[]
    } catch (e) {
      LogAppErrorService.saveError(e)
      return []
    }
  }
}

export default new LogAppErrorDatabase()
