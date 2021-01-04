import LogAppErrorModel from '../../types/log_app_error/api/LogAppErrorModel'
import EventService from '../events/EventService'
import AuthService from '../auth/AuthService'

class ErrorHandlerService {
  register = () => {
    window.addEventListener('error', (event) => this.log(event)) 
  }

  log = async (
    event: ErrorEvent
  ) => {
    const isAuthenticated = await AuthService.isAuthenticated()
    if (event && isAuthenticated) {
      const errorModel: LogAppErrorModel = {
        error: event.error,
        file: event.filename,
        title: event.message,
        date: new Date(),
      }

      EventService.whenError(errorModel)
    }

    return process.env.NODE_ENV === 'production' ? true : true
  }
}

export default new ErrorHandlerService()
