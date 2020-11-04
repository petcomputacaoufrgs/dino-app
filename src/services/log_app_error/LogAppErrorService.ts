import LogAppErrorModel from '../../types/log_app_error/LogAppErrorModel'
import DinoAgentService from '../../agent/DinoAgentService'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import LogAppErrorSyncLocalStorage from '../../storage/local_storage/log_app_error/LogAppErrorSyncLocalStorage'
import LogAppErrorListModel from '../../types/log_app_error/LogAppErrorListModel'
import LogAppModelError from '../../error/log_app_error/LogAppModelError'
import LogAppErrorDatabase from '../../storage/database/log_app_error/LogAppErrorDatabase'
import LogAppErrorEntity from '../../types/log_app_error/database/LogAppErrorEntity'

class LogAppErrorService {
  shouldSync = (): boolean => {
    return LogAppErrorSyncLocalStorage.getShouldSync()
  }

  getSavedLogs = (): Promise<LogAppErrorEntity[]> => {
    return LogAppErrorDatabase.getAll()
  }

  saveError = (error: Error) => {
    if (error) {
      this.save({
        date: new Date().getTime(),
        error: error.stack,
        title: error.message,
      } as LogAppErrorModel)
    }
  }

  save = async (model: LogAppErrorModel) => {
    if (model.date && model.error) {
      const request = await DinoAgentService.post(
        DinoAPIURLConstants.SAVE_LOG_APP_ERROR
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
    } else {
      this.saveError(new LogAppModelError(model))
    }
  }

  saveAll = async (models: LogAppErrorListModel) => {
    const request = await DinoAgentService.post(
      DinoAPIURLConstants.SAVE_ALL_LOG_APP_ERROR
    )

    if (request.canGo) {
      try {
        await request.authenticate().setBody(models).go()
        this.setShouldSync(false)
        LogAppErrorDatabase.deleteAll()
      } catch {
        this.setShouldSync(true)
      }
    } else {
      this.setShouldSync(true)
    }
  }

  removeUserData = () => {
    LogAppErrorSyncLocalStorage.removeUserData()
    LogAppErrorDatabase.deleteAll()
  }

  private saveLocalLog = (model: LogAppErrorModel) => {
    LogAppErrorDatabase.put(model)
  }

  private setShouldSync = (should: boolean) => {
    LogAppErrorSyncLocalStorage.setShouldSync(should)
  }
}

export default new LogAppErrorService()
