import LogAppErrorService from '../services/log_app_error/LogAppErrorService'
import LogAppErrorModel from '../types/log_app_error/LogAppErrorModel'
import EventsService from '../services/events/EventsService'
import AuthService from '../services/auth/AuthService'

class ErrorHandler {
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
      LogAppErrorService.save({
        error: error.stack,
        file: source,
        title: typeof event === 'string' ? event : null,
      } as LogAppErrorModel)

      EventsService.whenError()
    }
  }
}

export default new ErrorHandler()
