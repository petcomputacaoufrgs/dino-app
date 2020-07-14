import BaseUpdater from '../../types/services/BaseUpdater'
import AppSettingsService from './AppSettingsService'

class AppSettingsUpdater implements BaseUpdater {
  checkUpdates = async (): Promise<void> => {
    const updatedVersion = await AppSettingsService.getServerVersion()

    if (updatedVersion === undefined) {
      AppSettingsService.setShouldSync(true)

      return
    }

    if (updatedVersion === 0) {
      const defaultAppSettings = AppSettingsService.getDefaultAppSettings()

      await AppSettingsService.saveOnServer(defaultAppSettings)

      return
    }

    AppSettingsService.update(updatedVersion)
  }
}

export default new AppSettingsUpdater()
