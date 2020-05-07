import BaseUpdater from '../BaseUpdater'
import LanguageSubProviderValue from '../../provider/app_provider/language_sub_provider/value'
import AppSettingsService from './AppSettingsService'
import AppSettingsResponseModel from './api_model/AppSettingsResponseModel'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import DinoAgentService from '../dino_agent/DinoAgentService'

class AppSettingsUpdater implements BaseUpdater {
  checkUpdates = async (
    languageContext?: LanguageSubProviderValue,
  ): Promise<void> => {
    const updatedVersion = await this.getAppSettingsVersion()

    if (updatedVersion === 0) {
      const defaultAppSettings = AppSettingsService.getDefaultAppSettings()

      await AppSettingsService.saveOnServer(defaultAppSettings)

      return
    }

    const savedVersion = AppSettingsService.getAppSettingsVersion()

    if (updatedVersion !== savedVersion) {
      const appSettings = await this.getAppSettingsFromServer()

      AppSettingsService.saveAppSettingsData(appSettings, updatedVersion)

      if (languageContext) {
        languageContext.updateLanguage()
      }
    }
  }

  private getAppSettingsFromServer = async (): Promise<
    AppSettingsResponseModel
  > => {
    const response = await DinoAgentService.get(
      DinoAPIURLConstants.APP_SETTINGS_GET,
    )

    const appSettings: AppSettingsResponseModel = response.body

    return appSettings
  }

  private getAppSettingsVersion = async (): Promise<number> => {
    const response = await DinoAgentService.get(
      DinoAPIURLConstants.APP_SETTINGS_VERSION,
    )

    const version: number = response.body

    return version
  }
}

export default new AppSettingsUpdater()
