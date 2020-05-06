import DinoAPIURLConstants from "../constants/dino_api/DinoAPIURLConstants"
import SettingsLocalStorage from "../local_storage/SettingsLocalStorage"
import AppSettingsResponseModel from '../model/dino_api/settings/AppSettingsResponseModel'
import AppSettingsModel from '../model/dino_api/settings/AppSettingsModel'
import LanguageSubProviderValue from "../provider/app_provider/language_sub_provider/value"
import DinoAgentService from "./DinoAgentService"

class AppSettingsService {

    checkUpdate = async (languageContext?: LanguageSubProviderValue): Promise<void> => {
        const updatedVersion = await this.getAppSettingsVersion()

        if (updatedVersion === 0) {

            const defaultAppSettings = this.getDefaultAppSettings()

            await this.update(defaultAppSettings)
            
            return
        } 

        const savedVersion = SettingsLocalStorage.getAppSettingsVersion()

        if (updatedVersion !== savedVersion) {
            const appSettings = await this.getAppSettingsFromServer()

            this.saveAppSettingsData(appSettings, updatedVersion)

            if (languageContext) {
                languageContext.updateLanguage()
            }
        }
    }

    get = (): AppSettingsModel => {
        const savedVersion = SettingsLocalStorage.getAppSettingsVersion()

        const savedAppSettings = SettingsLocalStorage.getAppSettings()

        if (savedVersion !== 0) {
            if (savedAppSettings) {
                return savedAppSettings
            }
        }

        return savedAppSettings ? savedAppSettings : this.getDefaultAppSettings()
    }
    
    update = async (model: AppSettingsModel): Promise<void> => {
        
        const response = await DinoAgentService.post(DinoAPIURLConstants.APP_SETTINGS_SAVE).send(model)
        
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
        const response = await DinoAgentService.get(DinoAPIURLConstants.APP_SETTINGS_GET)

        const appSettings: AppSettingsResponseModel = response.body

        return appSettings
    }

    private getAppSettingsVersion = async (): Promise<number> => {
        const response = await DinoAgentService.get(DinoAPIURLConstants.APP_SETTINGS_VERSION)

        const version: number = response.body

        return version
    }

    private saveAppSettingsData = (model: AppSettingsModel, version: number) => {
        SettingsLocalStorage.setAppSettingsVersion(version)
        SettingsLocalStorage.setAppSettings(model)
    }
}

export default new AppSettingsService()