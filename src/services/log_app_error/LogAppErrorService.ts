import LogAppErrorModel from '../../types/log_app_error/LogAppErrorModel'
import DinoAgentService from '../agent/dino/DinoAgentService'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import AgentStatus from '../../types/services/agent/AgentStatus'
import LogAppErrorSyncLocalStorage from './local_storage/LogAppErrorSyncLocalStorage'
import LogAppErrorDatabase from './database/LogAppErrorDatabase'
import LogAppErrorDoc from '../../types/log_app_error/database/LogAppErrorDoc'
import LogAppErrorListModel from '../../types/log_app_error/LogAppErrorListModel'

class LogAppErrorService {
  shouldSync = (): boolean => {
    return LogAppErrorSyncLocalStorage.getShouldSync()
  }

  setShouldSync = (should: boolean) => {
    LogAppErrorSyncLocalStorage.setShouldSync(should)
  }

  getSavedLogs = (): Promise<LogAppErrorDoc[]> => {
    return LogAppErrorDatabase.getAll()
  }

  saveLocalLog = (model: LogAppErrorModel) => {
    const doc = {
      error: model.error,
      file: model.file,
      title: model.title,
    } as LogAppErrorDoc

    LogAppErrorDatabase.put(doc)
  }

  save = async (model: LogAppErrorModel) => {
    const request = await DinoAgentService.post(
      DinoAPIURLConstants.SAVE_LOG_APP_ERROR
    )

    if (request.status === AgentStatus.OK) {
      try {
        await request.get()!.send(model)
      } catch {
        this.saveLocalLog(model)
        this.setShouldSync(true)
      }
    } else {
      this.saveLocalLog(model)
      this.setShouldSync(true)
    }
  }

  saveAll = async (models: LogAppErrorListModel) => {
    const request = await DinoAgentService.post(
      DinoAPIURLConstants.SAVE_ALL_LOG_APP_ERROR
    )

    console.log(models)

    if (request.status === AgentStatus.OK) {
      try {
        await request.get()!.send(models)
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
}

export default new LogAppErrorService()
