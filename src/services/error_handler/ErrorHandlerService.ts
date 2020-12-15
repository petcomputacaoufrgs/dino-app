import LogAppErrorService from '../log_app_error/LogAppErrorService'
import LogAppErrorModel from '../../types/log_app_error/api/LogAppErrorModel'
import EventService from '../events/EventService'
import AuthService from '../auth/AuthService'

class ErrorHandlerService {
  register = () => {
    window.onerror = this.log
  }

  log = (
    event: Event | string,
    source?: string,
    lineno?: number,
    colno?: number,
    error?: Error
  ) => {
    if (error && AuthService.isAuthenticated()) {
      LogAppErrorService.logModel({
        error: error.stack,
        file: source,
        title: event && typeof event === 'string' ? event : null,
        date: new Date().getTime(),
      } as LogAppErrorModel)

      EventService.whenError()
    }

    return process.env.NODE_ENV === 'production' ? true : true
  }
}

export default new ErrorHandlerService()
