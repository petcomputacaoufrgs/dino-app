import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import AppSettingsLocalStorage from '../../local_storage/AppSettingsLocalStorage'
import AppSettingsModel from '../../types/app_settings/AppSettingsModel'
import DinoAgentService from '../../agent/DinoAgentService'
import AgentStatus from '../../types/agent/AgentStatus'
import AppSettingsResponseModel from '../../types/app_settings/AppSettingsResponseModel'
import LanguageBase from '../../types/languages/LanguageBase'
import LanguageCodeConstants from '../../constants/LanguageCodeConstants'
import PT from '../../types/languages/PT'
import EN from '../../types/languages/EN'
import AppSettingsContextUpdater from '../../context_updater/AppSettingsContextUpdater'
import LogAppErrorService from '../log_app_error/LogAppErrorService'

class AppSettingsService {
  listenner = {}

  get = (): AppSettingsModel => {
    const savedVersion = AppSettingsLocalStorage.getAppSettingsVersion()

    const savedAppSettings = AppSettingsLocalStorage.getAppSettings()

    if (savedVersion !== 0) {
      if (savedAppSettings) {
        return savedAppSettings
      }
    }

    return savedAppSettings ? savedAppSettings : this.getDefaultAppSettings()
  }

  set = (appSettings: AppSettingsModel) => {
    this.updateLocalAppSettings(appSettings)

    this.saveOnServer(appSettings)
  }

  update = async (newVersion: number) => {
    const savedVersion = this.getVersion()

    if (newVersion !== savedVersion) {
      const appSettings = await this.getServer()

      if (appSettings) {
        AppSettingsLocalStorage.setAppSettingsVersion(newVersion)
        this.updateLocalAppSettings(appSettings)
      } else {
        this.setShouldSync(true)
      }
    }
  }

  getVersion = (): number => AppSettingsLocalStorage.getAppSettingsVersion()

  getServerVersion = async (): Promise<number | undefined> => {
    const request = await DinoAgentService.get(
      DinoAPIURLConstants.APP_SETTINGS_VERSION
    )

    if (request.status === AgentStatus.OK) {
      try {
        const response = await request.get()!
        const version: number = response.body

        return version
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }

    return undefined
  }

  getServer = async (): Promise<AppSettingsResponseModel | undefined> => {
    const request = await DinoAgentService.get(
      DinoAPIURLConstants.APP_SETTINGS_GET
    )

    if (request.status === AgentStatus.OK) {
      try {
        const response = await request.get()!

        const appSettings: AppSettingsResponseModel = response.body

        return appSettings
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }

    return undefined
  }

  removeUserData = () => {
    AppSettingsLocalStorage.removeUserData()
  }

  getDefaultAppSettings = (): AppSettingsModel => {
    const defaultAppSettings: AppSettingsModel = {
      language: navigator.language.slice(0, 2),
    }

    return defaultAppSettings
  }

  shouldSync = (): boolean => AppSettingsLocalStorage.getShouldSync()

  setShouldSync = (should: boolean) => {
    AppSettingsLocalStorage.setShouldSync(should)
  }

  saveOnServer = async (model: AppSettingsModel): Promise<void> => {
    const request = await DinoAgentService.post(
      DinoAPIURLConstants.APP_SETTINGS_SAVE
    )

    if (request.status === AgentStatus.OK) {
      try {
        const response = await request.get()!.send(model)
        const newVersion = response.body

        AppSettingsLocalStorage.setAppSettingsVersion(newVersion)

        return
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }

    AppSettingsLocalStorage.setShouldSync(true)
  }

  getLanguageBase = (): LanguageBase => {
    const language = this.get().language

    return this.getLanguageBaseByCode(language)
  }

  returnAppSettingsToDefault = (): void => {
    const appSettings = this.getDefaultAppSettings()
    this.updateLocalAppSettings(appSettings)
  }

  private updateLocalAppSettings = (appSettings: AppSettingsModel) => {
    AppSettingsLocalStorage.setAppSettings(appSettings)
    AppSettingsContextUpdater.update()
  }

  private getLanguageBaseByCode = (languageCode: string): LanguageBase => {
    if (languageCode === LanguageCodeConstants.PORTUGUESE) {
      return new PT()
    } else {
      return new EN()
    }
  }
}

export default new AppSettingsService()
