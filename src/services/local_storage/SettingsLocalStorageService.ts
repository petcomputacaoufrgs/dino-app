import { LocalStorageService } from './LocalStorageService'
import LS_Constants from "../../constants/LocalStorageKeysConstants"
import AppSettingsModel from '../../model/AppSettingsModel'

class SettingsLocalStorageService extends LocalStorageService {

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

}

export default new SettingsLocalStorageService()