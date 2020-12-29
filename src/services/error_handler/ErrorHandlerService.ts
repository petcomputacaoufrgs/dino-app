import LogAppErrorModel from '../../types/log_app_error/api/LogAppErrorModel'
import EventService from '../events/EventService'
import AuthService from '../auth/AuthService'

class ErrorHandlerService {
  register = () => {
    window.onerror = this.log
  }

  log = async (
    event: Event | string,
    source?: string,
    lineno?: number,
    colno?: number,
    error?: Error
  ) => {
    const isAuthenticated = await AuthService.isAuthenticated()
    if (error && error.stack && isAuthenticated) {
      const errorModel: LogAppErrorModel = {
        error: error.stack,
        file: source,
        title: event && typeof event === 'string' ? event : undefined,
        date: new Date(),
      }

      EventService.whenError(errorModel)
    }

    return process.env.NODE_ENV === 'production' ? true : true
  }
}

export default new ErrorHandlerService()
