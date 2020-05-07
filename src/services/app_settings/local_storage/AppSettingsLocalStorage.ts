import BaseLocalStorage from '../../BaseLocalStorage'
import LS_Constants from '../../../constants/LocalStorageKeysConstants'
import AppSettingsModel from '../api_model/AppSettingsModel'

class AppSettingsLocalStorage extends BaseLocalStorage {
  getAppSettingsVersion = (): number => {
    const versionSaved = this.get(LS_Constants.APP_SETTINGS_VERSION)

    return versionSaved ? Number(versionSaved) : 0
  }

  setAppSettingsVersion = (version: number) => {
    this.set(LS_Constants.APP_SETTINGS_VERSION, JSON.stringify(version))
  }

  removeAppSettingsVersion = () => {
    this.remove(LS_Constants.APP_SETTINGS_VERSION)
  }

  getAppSettings = (): AppSettingsModel | null => {
    const savedSettings = this.get(LS_Constants.APP_SETTINGS)

    if (savedSettings) {
      const appSettings: AppSettingsModel = JSON.parse(savedSettings)

      return appSettings
    }

    return null
  }

  setAppSettings = (appSettings: AppSettingsModel) => {
    this.set(LS_Constants.APP_SETTINGS, JSON.stringify(appSettings))
  }

  removeAppSettings = () => {
    this.remove(LS_Constants.APP_SETTINGS)
  }

  removeUserData = () => {
    this.removeAppSettingsVersion()
    this.removeAppSettings()
  }
}

export default new AppSettingsLocalStorage()
