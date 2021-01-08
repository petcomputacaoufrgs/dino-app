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
    if (event) {
      const isAuthenticated = await AuthService.isAuthenticated()
      if (isAuthenticated) {
        const errorModel: LogAppErrorModel = {
          error: event.message,
          file: event.filename,
          date: new Date(),
        }
  
        EventService.whenError(errorModel)
      }
    }
  }
}

export default new ErrorHandlerService()
