import AppSettingsService from './AppSettingsService'
import LanguageSubProviderValue from '../../provider/app_provider/language_sub_provider/value'
import BaseSync from '../BaseSync'

class AppSettingsSync implements BaseSync {
  sync = async (
    languageContext?: LanguageSubProviderValue
  ): Promise<boolean> => {
    if (AppSettingsService.shouldSync()) {
      console.log('oi')
      const serverVersion = await AppSettingsService.getAppSettingsVersionFromServer()

      if (serverVersion !== undefined) {
        const localVersion = AppSettingsService.getAppSettingsVersion()

        if (localVersion === serverVersion) {
          AppSettingsService.setShouldSync(false)

          return true
        }

        if (localVersion > serverVersion) {
          const localSettings = AppSettingsService.get()

          AppSettingsService.saveOnServer(localSettings)

          AppSettingsService.setShouldSync(false)

          return true
        }

        if (localVersion < serverVersion) {
          const appSettings = await AppSettingsService.getAppSettingsFromServer()

          if (appSettings) {
            AppSettingsService.saveAppSettingsData(appSettings, serverVersion)

            if (languageContext) {
              languageContext.updateLanguage()
            }

            AppSettingsService.setShouldSync(false)

            return true
          }
        }
      }

      return false
    }

    return true
  }
}

export default new AppSettingsSync()
