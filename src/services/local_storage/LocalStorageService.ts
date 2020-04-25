import LS_Constants from "../../constants/LocalStorageKeysConstants"
import AppSettingsModel from '../../model/AppSettingsModel'

/**
 * @description 
 * - Auxilia a gravar e ler valores do local storage
 * Quando o objeto não for uma string é necessário o stringify caso contrário não é possível acessar os dados
 * - Caso adicione algo temporário que não deve permanecer salvo quando o aplicativo reiniciar, 
 * adicione um método de remoção no cleanLocalStorageGarbage
 * */
export class LocalStorageService {

    protected get = (key: string) : string | null => (
        localStorage.getItem(key)
    )

    protected set = (key: string, value: string) => {
        if (!key) {
            throw Error("Chave inválida!")
        } else {
            return localStorage.setItem(key, value)
        } 
    }

    protected remove = (key: string) => {
        if (!key) {
            throw Error("Chave inválida!")
        } else {
            return localStorage.removeItem(key)
        } 
    }

    cleanLocalStorageGarbage = () => {
        this.setRefreshRequiredToFalse()
    }

    isRefreshRequired = (): boolean => (
        Boolean(this.get(LS_Constants.REFRESH_TOKEN_REQUIRED))
    )
 
    setRefreshRequiredToTrue = () => {
        this.set(LS_Constants.REFRESH_TOKEN_REQUIRED, 't')
    }
    
    setRefreshRequiredToFalse = () => {
        this.remove(LS_Constants.REFRESH_TOKEN_REQUIRED)
    } 

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

    protected convertStringOrNullToString = (nullableString: string | null): string => (
        nullableString ? nullableString : ''
    )
    
}

export default new LocalStorageService()