import LogAppErrorModel from '../../types/log_app_error/api/LogAppErrorModel'
import DinoAgentService from '../../agent/DinoAgentService'
import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import LogAppErrorSyncLocalStorage from '../../storage/local_storage/log_app_error/LogAppErrorSyncLocalStorage'
import LogAppErrorListModel from '../../types/log_app_error/api/LogAppErrorListModel'
import LogAppErrorRepository from '../../storage/database/log_app_error/LogAppErrorRepository'
import LogAppErrorEntity from '../../types/log_app_error/database/LogAppErrorEntity'

class LogAppErrorService {
  shouldSync = (): boolean => {
    return LogAppErrorSyncLocalStorage.getShouldSync()
  }

  getSavedLogs = (): Promise<LogAppErrorEntity[]> => {
    return LogAppErrorRepository.getAll()
  }

  logError = (error: Error) => {
    if (error) {
      this.logModel({
        date: new Date().getTime(),
        error: error.stack,
        title: error.message,
      } as LogAppErrorModel)
    }
  }

  logModel = async (model: LogAppErrorModel) => {
    if (model.error) {
      if (!model.date) {
        model.date = new Date().getTime()
      }

      const request = await DinoAgentService.post(
        APIRequestMappingConstants.SAVE_LOG_APP_ERROR
      )

      if (request.canGo) {
        try {
          await request.authenticate().setBody(model).go()
        } catch {
          this.saveLocalLog(model)
          this.setShouldSync(true)
        }
      } else {
        this.saveLocalLog(model)
        this.setShouldSync(true)
      }
    }
  }

  logSyncAPIError = (error: string) => {
    if (error) {
      this.logModel({
        date: new Date().getTime(),
        error: error,
        title: 'API error',
      } as LogAppErrorModel)
    }
  }

  logMessage = (message: string, title: string) => {
    if (message) {
      this.logModel({
        date: new Date().getTime(),
        error: message,
        title: title,
      } as LogAppErrorModel)
    }
  }

  saveAll = async (models: LogAppErrorListModel) => {
    const request = await DinoAgentService.post(
      APIRequestMappingConstants.SAVE_ALL_LOG_APP_ERROR
    )

    if (request.canGo) {
      try {
        await request.authenticate().setBody(models).go()
        this.setShouldSync(false)
        LogAppErrorRepository.deleteAll()
      } catch {
        this.setShouldSync(true)
      }
    } else {
      this.setShouldSync(true)
    }
  }

  removeData = () => {
    LogAppErrorSyncLocalStorage.removeUserData()
    LogAppErrorRepository.deleteAll()
  }

  private saveLocalLog = (model: LogAppErrorModel) => {
    LogAppErrorRepository.put(model)
  }

  private setShouldSync = (should: boolean) => {
    LogAppErrorSyncLocalStorage.setShouldSync(should)
  }
}

export default new LogAppErrorService()
