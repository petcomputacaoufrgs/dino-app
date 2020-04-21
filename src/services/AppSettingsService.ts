import DinoHttpService from "./DinoHttpService"
import DinoAPIURLConstants from "../constants/DinoAPIURLConstants"
import LocalStorageService from "./LocalStorageService"
import AppSettingsResponseModel from '../model/AppSettingsResponseModel'
import AppSettingsModel from '../model/AppSettingsModel'
import LanguageProviderValue from "../components/language_provider/LanguageProviderValue"

class AppSettingsService {

    checkUpdate = async (languageProvider?: LanguageProviderValue): Promise<void> => {
        const updatedVersion = await this.getAppSettingsVersion()

        if (updatedVersion === 0) {

            const defaultAppSettings = this.getDefaultAppSettings()

            await this.updateAppSettings(defaultAppSettings)
            
            return
        } 

        const savedVersion = LocalStorageService.getAppSettingsVersion()

        if (updatedVersion !== savedVersion) {
            const appSettings = await this.getAppSettingsFromServer()

            this.saveAppSettingsData(appSettings, updatedVersion)

            if (languageProvider) {
                languageProvider.updateLanguage()
            }
        }
    }

    getAppSettings = (): AppSettingsModel => {
        const savedVersion = LocalStorageService.getAppSettingsVersion()

        const savedAppSettings = LocalStorageService.getAppSettings()

        if (savedVersion !== 0) {
            if (savedAppSettings) {
                return savedAppSettings
            }
        }

        return savedAppSettings ? savedAppSettings : this.getDefaultAppSettings()
    }
    
    updateAppSettings = async (model: AppSettingsModel): Promise<void> => {
        
        const response = await DinoHttpService.post(DinoAPIURLConstants.PATH_APP_SETTINGS_SAVE).send(model)
        
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
        const response = await DinoHttpService.get(DinoAPIURLConstants.PATH_APP_SETTINGS_GET)

        const appSettings: AppSettingsResponseModel = response.body

        return appSettings
    }

    private getAppSettingsVersion = async (): Promise<number> => {
        const response = await DinoHttpService.get(DinoAPIURLConstants.PATH_APP_SETTINGS_VERSION)

        const version: number = response.body

        return version
    }

    private saveAppSettingsData = (model: AppSettingsModel, version: number) => {
        LocalStorageService.setAppSettingsVersion(version)
        LocalStorageService.setAppSettings(model)
    }
}

export default new AppSettingsService()