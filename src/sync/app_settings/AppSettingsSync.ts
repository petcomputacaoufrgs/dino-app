import AppSettingsService from '../../services/app_settings/AppSettingsService'
import BaseSync from '../BaseSync'

class AppSettingsSync implements BaseSync {
  send = async () => {
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

  receive = async () => {
    const updatedVersion = await AppSettingsService.getServerVersion()

    if (updatedVersion === undefined) {
      return
    }

    if (updatedVersion === 0) {
      const defaultAppSettings = AppSettingsService.getDefaultAppSettings()

      await AppSettingsService.saveOnServer(defaultAppSettings)
    }

    AppSettingsService.update(updatedVersion)

    return
  }
}

export default new AppSettingsSync()
