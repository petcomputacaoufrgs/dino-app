import AppSettingsService from './AppSettingsService'
import BaseSync from '../../types/services/BaseSync'

class AppSettingsSync implements BaseSync {
  sync = async (): Promise<boolean> => {
    if (AppSettingsService.shouldSync()) {
      const serverVersion = await AppSettingsService.getServerVersion()

      if (serverVersion !== undefined) {
        const localVersion = AppSettingsService.getVersion()

        if (localVersion >= serverVersion) {
          const localSettings = AppSettingsService.get()

          AppSettingsService.saveOnServer(localSettings)

          AppSettingsService.setShouldSync(false)
        }

        return true
      }

      return false
    }

    return true
  }
}

export default new AppSettingsSync()
