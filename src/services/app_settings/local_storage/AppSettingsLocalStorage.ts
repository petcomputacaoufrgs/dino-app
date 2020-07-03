import BaseLocalStorage from '../../BaseLocalStorage'
import LS_Constants from '../../../constants/LocalStorageKeysConstants'
import AppSettingsModel from '../../../types/app_settings/AppSettingsModel'

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

  getShouldSync = (): boolean => {
    const shouldSync = this.get(LS_Constants.APP_SETTINGS_SHOULD_SYNC)

    if (shouldSync) {
      return JSON.parse(shouldSync)
    }

    return false
  }

  setShouldSync = (shouldSync: boolean) => {
    this.set(LS_Constants.APP_SETTINGS_SHOULD_SYNC, JSON.stringify(shouldSync))
  }

  removeShouldSync = () => {
    this.remove(LS_Constants.APP_SETTINGS_SHOULD_SYNC)
  }

  removeUserData = () => {
    this.removeAppSettingsVersion()
    this.removeAppSettings()
    this.removeShouldSync()
  }
}

export default new AppSettingsLocalStorage()
