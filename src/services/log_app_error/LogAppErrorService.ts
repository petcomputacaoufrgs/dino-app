import LogAppErrorModel from '../../types/log_app_error/LogAppErrorModel'
import DinoAgentService from '../../agent/DinoAgentService'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import LogAppErrorSyncLocalStorage from '../../local_storage/log_app_error/LogAppErrorSyncLocalStorage'
import LogAppErrorDatabase from '../../database/LogAppErrorDatabase'
import LogAppErrorDoc from '../../types/log_app_error/database/LogAppErrorDoc'
import LogAppErrorListModel from '../../types/log_app_error/LogAppErrorListModel'
import LogAppModelError from '../../error/log_app_error/LogAppModelError'

class LogAppErrorService {
  shouldSync = (): boolean => {
    return LogAppErrorSyncLocalStorage.getShouldSync()
  }

  getSavedLogs = (): Promise<LogAppErrorDoc[]> => {
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
      } catch {
        this.setShouldSync(true)
      }
    } else {
      this.setShouldSync(true)
    }
  }

  removeUserData = () => {
    LogAppErrorSyncLocalStorage.removeUserData()
    LogAppErrorDatabase.removeAll()
  }

  private saveLocalLog = (model: LogAppErrorModel) => {
    const doc = {
      ...model,
    } as LogAppErrorDoc

    LogAppErrorDatabase.put(doc)
  }

  private setShouldSync = (should: boolean) => {
    LogAppErrorSyncLocalStorage.setShouldSync(should)
  }
}

export default new LogAppErrorService()
