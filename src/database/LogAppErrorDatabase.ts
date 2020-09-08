import BaseDatabase from './BaseDatabase'
import DatabaseConstants from '../constants/DatabaseConstants'
import LogAppErrorDoc from '../types/log_app_error/database/LogAppErrorDoc'

const getId = (doc?: LogAppErrorDoc): string => new Date().getTime().toString()

class LogAppErrorDatabase extends BaseDatabase<LogAppErrorDoc> {
  constructor() {
    super(DatabaseConstants.LOG_APP_ERROR, getId)
  }
}

export default new LogAppErrorDatabase()
