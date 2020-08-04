import BaseUpdater from '../../types/services/BaseUpdater'
import AppSettingsService from './AppSettingsService'

class AppSettingsUpdater implements BaseUpdater {
  checkUpdates = async () => {
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

export default new AppSettingsUpdater()
