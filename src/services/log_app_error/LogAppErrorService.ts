import LogAppErrorModel from '../../types/log_app_error/api/LogAppErrorModel'
import DinoAgentService from '../../agent/DinoAgentService'
import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import LogAppErrorSyncLocalStorage from '../../storage/local_storage/log_app_error/LogAppErrorSyncLocalStorage'
import LogAppErrorListModel from '../../types/log_app_error/api/LogAppErrorListModel'
import LogAppErrorRepository from '../../storage/database/log_app_error/LogAppErrorRepository'
import LogAppErrorEntity from '../../types/log_app_error/database/LogAppErrorEntity'
import UserDataService from '../events/UserDataService'
import BaseSynchronizableService from '../sync/BaseSynchronizableService'

class LogAppErrorService extends BaseSynchronizableService implements UserDataService {
  getDependencies(): BaseSynchronizableService[] {
    return []
  }

  protected async doSync(): Promise<boolean> {
    if (this.shouldSync()) {
      const logs = await this.getSavedLogs()

      const items: LogAppErrorModel[] = logs.map((log) => ({
        title: log.title,
        error: log.error,
        file: log.file,
        date: log.date,
      }))

      const model: LogAppErrorListModel = {
        items: items,
      }

      return this.saveAll(model)
    }

    return true
  }
  
  shouldSync = (): boolean => {
    return LogAppErrorSyncLocalStorage.getShouldSync()
  }

  getSavedLogs = (): Promise<LogAppErrorEntity[]> => {
    return LogAppErrorRepository.getAll()
  }

  logError = (error: Error) => {
    if (error) {
      this.logModel({
        date: new Date(),
        error: error.stack,
        title: error.message,
      } as LogAppErrorModel)
    }
  }

  logModel = async (model: LogAppErrorModel) => {
    if (model.error) {
      if (!model.date) {
        model.date = new Date()
      }

      const request = await DinoAgentService.post(
        APIRequestMappingConstants.SAVE_LOG_APP_ERROR
      )

      if (request.canGo) {
        try {
          const authRequest = await request.authenticate()
      
          await authRequest.setBody(model).go()
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
        date: new Date(),
        error: error,
        title: 'API error',
      } as LogAppErrorModel)
    }
  }

  logMessage = (message: string, title: string) => {
    if (message) {
      this.logModel({
        date: new Date(),
        error: message,
        title: title,
      } as LogAppErrorModel)
    }
  }

  saveAll = async (models: LogAppErrorListModel): Promise<boolean> => {
    const request = await DinoAgentService.post(
      APIRequestMappingConstants.SAVE_ALL_LOG_APP_ERROR
    )

    if (request.canGo) {
      try {
        const authRequest = await request.authenticate()
        await authRequest.setBody(models).go()
        this.setShouldSync(false)
        LogAppErrorRepository.deleteAll()
        return true
      } catch {
        this.setShouldSync(true)
      }
    } else {
      this.setShouldSync(true)
    }

    return false
  }

  onLogout = async () => {
    LogAppErrorSyncLocalStorage.removeUserData()
    return LogAppErrorRepository.deleteAll()
  }

  private saveLocalLog = (model: LogAppErrorModel) => {
    const entity: LogAppErrorEntity = {
      date: model.date,
      error: model.error,
      file: model.file,
      title: model.title
    }
    LogAppErrorRepository.put(entity)
  }

  private setShouldSync = (should: boolean) => {
    LogAppErrorSyncLocalStorage.setShouldSync(should)
  }
}

export default new LogAppErrorService()
