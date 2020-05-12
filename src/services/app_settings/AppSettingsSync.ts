import AppSettingsService from './AppSettingsService'
import LanguageSubProviderValue from '../../provider/app_provider/language_sub_provider/value'
import BaseSync from '../BaseSync'

class AppSettingsSync implements BaseSync {
  sync = async (languageContext?: LanguageSubProviderValue) => {
    if (AppSettingsService.shouldSync()) {
      const serverVersion = await AppSettingsService.getAppSettingsVersionFromServer()

      if (serverVersion !== undefined) {
        const localVersion = AppSettingsService.getAppSettingsVersion()

        if (localVersion === serverVersion) {
          return
        }

        if (localVersion > serverVersion) {
          const localSettings = AppSettingsService.get()

          AppSettingsService.saveOnServer(localSettings)

          return
        }

        if (localVersion < serverVersion) {
          const appSettings = await AppSettingsService.getAppSettingsFromServer()

          if (appSettings) {
            AppSettingsService.saveAppSettingsData(appSettings, serverVersion)

            if (languageContext) {
              languageContext.updateLanguage()
            }

            return
          }
        }
      }

      AppSettingsService.setShouldSync(true)
    }
  }
}

export default new AppSettingsSync()
