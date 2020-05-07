import DinoAPIURLConstants from "../../constants/dino_api/DinoAPIURLConstants"
import AppSettingsLocalStorage from "./local_storage/AppSettingsLocalStorage"
import AppSettingsModel from './api_model/AppSettingsModel'
import DinoAgentService from "../dino_agent/DinoAgentService"

class AppSettingsService {

    get = (): AppSettingsModel => {
        const savedVersion = AppSettingsLocalStorage.getAppSettingsVersion()

        const savedAppSettings = AppSettingsLocalStorage.getAppSettings()

        if (savedVersion !== 0) {
            if (savedAppSettings) {
                return savedAppSettings
            }
        }

        return savedAppSettings ? savedAppSettings : this.getDefaultAppSettings()
    }

    set = (appSettings: AppSettingsModel) => {
        AppSettingsLocalStorage.setAppSettings(appSettings)

        this.saveOnServer(appSettings)
    }

    getAppSettingsVersion = (): number => (
        AppSettingsLocalStorage.getAppSettingsVersion()
    )

    removeUserData = () => {
        AppSettingsLocalStorage.removeUserData()
    }

    getDefaultAppSettings = (): AppSettingsModel => {
        const defaultAppSettings: AppSettingsModel = {
            'language': navigator.language
        }

        return defaultAppSettings
    }
    
    saveOnServer = async (model: AppSettingsModel): Promise<void> => {
        
        const response = await DinoAgentService.post(DinoAPIURLConstants.APP_SETTINGS_SAVE).send(model)
        
        const newVersion = response.body

        this.saveAppSettingsData(model, newVersion)

    } 

    saveAppSettingsData = (model: AppSettingsModel, version: number) => {
        AppSettingsLocalStorage.setAppSettingsVersion(version)
        AppSettingsLocalStorage.setAppSettings(model)
    }
}

export default new AppSettingsService()