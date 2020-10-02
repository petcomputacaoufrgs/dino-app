import BaseDatabase from './BaseDatabase'
import DatabaseConstants from '../constants/database/DatabaseConstants'
import LogAppErrorDoc from '../types/log_app_error/database/LogAppErrorDoc'

const getId = (doc?: LogAppErrorDoc): string => new Date().getTime().toString()

const applyChanges = (
  origin: LogAppErrorDoc,
  changed: LogAppErrorDoc
): LogAppErrorDoc => {
  const newDoc: LogAppErrorDoc = {
    ...origin,
    date: changed.date,
    error: changed.error,
    file: changed.file,
    title: changed.title,
  }

  return newDoc
}

class LogAppErrorDatabase extends BaseDatabase<LogAppErrorDoc> {
  constructor() {
    super(DatabaseConstants.LOG_APP_ERROR, getId, applyChanges)
  }
}

export default new LogAppErrorDatabase()
