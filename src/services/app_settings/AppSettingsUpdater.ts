import BaseUpdater from '../BaseUpdater'
import LanguageSubProviderValue from '../../provider/app_provider/language_sub_provider/value'
import AppSettingsService from './AppSettingsService'

class AppSettingsUpdater implements BaseUpdater {
  checkUpdates = async (
    languageContext?: LanguageSubProviderValue
  ): Promise<void> => {
    const updatedVersion = await AppSettingsService.getAppSettingsVersionFromServer()

    if (updatedVersion === undefined) {
      AppSettingsService.setShouldSync(true)

      return
    }

    if (updatedVersion === 0) {
      const defaultAppSettings = AppSettingsService.getDefaultAppSettings()

      await AppSettingsService.saveOnServer(defaultAppSettings)

      return
    }

    const savedVersion = AppSettingsService.getAppSettingsVersion()

    if (updatedVersion !== savedVersion) {
      const appSettings = await AppSettingsService.getAppSettingsFromServer()

      if (appSettings) {
        AppSettingsService.saveAppSettingsData(appSettings, updatedVersion)

        if (languageContext) {
          languageContext.updateLanguage()
        }
      } else {
        AppSettingsService.setShouldSync(true)
      }
    }
  }
}

export default new AppSettingsUpdater()
