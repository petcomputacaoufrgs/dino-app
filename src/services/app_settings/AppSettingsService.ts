import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import AppSettingsLocalStorage from './local_storage/AppSettingsLocalStorage'
import AppSettingsModel from '../../types/app_settings/AppSettingsModel'
import DinoAgentService from '../dino_agent/DinoAgentService'
import DinoAgentStatus from '../../types/dino_agent/DinoAgentStatus'
import AppSettingsResponseModel from '../../types/app_settings/AppSettingsResponseModel'
import LanguageSubProviderValue from '../../provider/app_provider/language_provider/value'

class AppSettingsService {
  languageContext?: LanguageSubProviderValue

  start = (languageContext: LanguageSubProviderValue) => {
    this.languageContext = languageContext
  }

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
    AppSettingsLocalStorage.setAppSettings(appSettings)

    this.saveOnServer(appSettings)
  }

  update = async (newVersion: number) => {
    const savedVersion = this.getAppSettingsVersion()

    if (newVersion !== savedVersion) {
      const appSettings = await this.getAppSettingsFromServer()

      if (appSettings) {
        this.saveAppSettingsData(appSettings, newVersion)

        if (this.languageContext) {
          this.languageContext.updateLanguage()
        }
      } else {
        this.setShouldSync(true)
      }
    }
  }

  getAppSettingsVersion = (): number =>
    AppSettingsLocalStorage.getAppSettingsVersion()

  getAppSettingsVersionFromServer = async (): Promise<number | undefined> => {
    const request = DinoAgentService.get(
      DinoAPIURLConstants.APP_SETTINGS_VERSION
    )

    if (request.status === DinoAgentStatus.OK) {
      try {
        const response = await request.get()
        const version: number = response.body

        return version
      } catch {
        /**TO-DO Fazer log do erro */
      }
    }

    return undefined
  }

  getAppSettingsFromServer = async (): Promise<
    AppSettingsResponseModel | undefined
  > => {
    const request = DinoAgentService.get(DinoAPIURLConstants.APP_SETTINGS_GET)

    if (request.status === DinoAgentStatus.OK) {
      try {
        const response = await request.get()

        const appSettings: AppSettingsResponseModel = response.body

        return appSettings
      } catch {
        /**TO-DO Fazer log do erro */
      }
    }

    return undefined
  }

  removeUserData = () => {
    AppSettingsLocalStorage.removeUserData()
  }

  getDefaultAppSettings = (): AppSettingsModel => {
    const defaultAppSettings: AppSettingsModel = {
      language: navigator.language,
    }

    return defaultAppSettings
  }

  shouldSync = (): boolean => AppSettingsLocalStorage.getShouldSync()

  setShouldSync = (should: boolean) => {
    AppSettingsLocalStorage.setShouldSync(should)
  }

  saveOnServer = async (model: AppSettingsModel): Promise<void> => {
    const request = DinoAgentService.post(DinoAPIURLConstants.APP_SETTINGS_SAVE)

    if (request.status === DinoAgentStatus.OK) {
      try {
        const response = await request.get().send(model)
        const newVersion = response.body

        this.saveAppSettingsData(model, newVersion)

        return
      } catch {
        /**TO-DO Fazer log do erro */
      }
    }

    AppSettingsLocalStorage.setShouldSync(true)
  }

  saveAppSettingsData = (model: AppSettingsModel, version: number) => {
    AppSettingsLocalStorage.setAppSettingsVersion(version)
    AppSettingsLocalStorage.setAppSettings(model)
  }
}

export default new AppSettingsService()
