import DinoHttpService from "./DinoHttpService"
import DinoAPIURLConstants from "../constants/DinoAPIURLConstants"
import SettingsLocalStorageService from "./local_storage/SettingsLocalStorageService"
import AppSettingsResponseModel from '../model/AppSettingsResponseModel'
import AppSettingsModel from '../model/AppSettingsModel'
import LanguageContextValue from "../components/language_provider/context"

class AppSettingsService {

    checkUpdate = async (languageContext?: LanguageContextValue): Promise<void> => {
        const updatedVersion = await this.getAppSettingsVersion()

        if (updatedVersion === 0) {

            const defaultAppSettings = this.getDefaultAppSettings()

            await this.updateAppSettings(defaultAppSettings)
            
            return
        } 

        const savedVersion = SettingsLocalStorageService.getAppSettingsVersion()

        if (updatedVersion !== savedVersion) {
            const appSettings = await this.getAppSettingsFromServer()

            this.saveAppSettingsData(appSettings, updatedVersion)

            if (languageContext) {
                languageContext.updateLanguage()
            }
        }
    }

    getAppSettings = (): AppSettingsModel => {
        const savedVersion = SettingsLocalStorageService.getAppSettingsVersion()

        const savedAppSettings = SettingsLocalStorageService.getAppSettings()

        if (savedVersion !== 0) {
            if (savedAppSettings) {
                return savedAppSettings
            }
        }

        return savedAppSettings ? savedAppSettings : this.getDefaultAppSettings()
    }
    
    updateAppSettings = async (model: AppSettingsModel): Promise<void> => {
        
        const response = await DinoHttpService.post(DinoAPIURLConstants.APP_SETTINGS_SAVE).send(model)
        
        const newVersion = response.body

        this.saveAppSettingsData(model, newVersion)

    }

    private getDefaultAppSettings = (): AppSettingsModel => {
        const defaultAppSettings: AppSettingsModel = {
            'language': navigator.language
        }

        return defaultAppSettings
    }

    private getAppSettingsFromServer = async (): Promise<AppSettingsResponseModel> => {
        const response = await DinoHttpService.get(DinoAPIURLConstants.APP_SETTINGS_GET)

        const appSettings: AppSettingsResponseModel = response.body

        return appSettings
    }

    private getAppSettingsVersion = async (): Promise<number> => {
        const response = await DinoHttpService.get(DinoAPIURLConstants.APP_SETTINGS_VERSION)

        const version: number = response.body

        return version
    }

    private saveAppSettingsData = (model: AppSettingsModel, version: number) => {
        SettingsLocalStorageService.setAppSettingsVersion(version)
        SettingsLocalStorageService.setAppSettings(model)
    }
}

export default new AppSettingsService()