import AppSettingsService from './AppSettingsService'
import BaseSync from '../../types/services/BaseSync'

class AppSettingsSync implements BaseSync {
  sync = async () => {
    if (AppSettingsService.shouldSync()) {
      const serverVersion = await AppSettingsService.getServerVersion()

      if (serverVersion !== undefined) {
        AppSettingsService.setShouldSync(false)

        const localVersion = AppSettingsService.getVersion()

        if (localVersion >= serverVersion) {
          const localSettings = AppSettingsService.get()

          AppSettingsService.saveOnServer(localSettings)
        }
      }
    }
  }
}

export default new AppSettingsSync()
