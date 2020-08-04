import BaseUpdater from '../BaseUpdater'
import AppSettingsService from './AppSettingsService'

class AppSettingsUpdater implements BaseUpdater {
  checkUpdates = async (): Promise<void> => {
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

    AppSettingsService.update(updatedVersion)
  }
}

export default new AppSettingsUpdater()
