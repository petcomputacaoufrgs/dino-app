import LS_Constants from "../constants/LocalStorageKeysConstants"
import GlossaryItemModel from '../model/GlossaryItemModel'
import AppSettingsModel from '../model/AppSettingsModel'

/**
 * @description 
 * - Auxilia a gravar e ler valores do local storage
 * Quando o objeto não for uma string é necessário o stringify caso contrário não é possível acessar os dados
 * - Caso adicione algo temporário que não deve permanecer salvo quando o aplicativo reiniciar, 
 * adicione um método de remoção no cleanLocalStorageGarbage
 * */

class LocalStorageService {
    private get = (key: string) : string | null => (
        localStorage.getItem(key)
    )

    private set = (key: string, value: string) => {
        if (!key) {
            throw Error("Chave inválida!")
        } else {
            return localStorage.setItem(key, value)
        } 
    }

    private remove = (key: string) => {
        if (!key) {
            throw Error("Chave inválida!")
        } else {
            return localStorage.removeItem(key)
        } 
    }

    cleanLocalStorageGarbage = () => {
        this.setRefreshRequiredToFalse()
    }
    
    getAuthToken = () : string => {
        const authToken = this.get(LS_Constants.AUTH_TOKEN)
        
        return this.convertStringOrNullToString(authToken)
    }

    setAuthToken = (accessToken: string) => {
        this.set(LS_Constants.AUTH_TOKEN, accessToken)
    }
    
    removeAuthToken = () => {
        this.remove(LS_Constants.AUTH_TOKEN)
    }

    getGlossaryVersion = () : number => {
        let version = this.get(LS_Constants.GLOSSARY_VERSION)

        return version ? Number(version) : -1   
    }

    getGlossaryItems = () : Array<GlossaryItemModel> => {
        let items = this.get(LS_Constants.GLOSSARY_ITEMS)

        let result = new Array<GlossaryItemModel>()

        if (items) {
            result = JSON.parse(items)
        }
        
        return result
    }

    removeGlossaruItems = () => {
        this.remove(LS_Constants.GLOSSARY_ITEMS)
    }

    setGlossaryVersion = (version: number) => {
        this.set(LS_Constants.GLOSSARY_VERSION, JSON.stringify(version))
    }

    setGlossaryItems = (items: GlossaryItemModel[]) => {
        this.set(LS_Constants.GLOSSARY_ITEMS, JSON.stringify(items))
    }

    removeGlossaryVersion = () => {
        this.remove(LS_Constants.GLOSSARY_VERSION)
    }

    getGoogleAccessToken = (): string | null => (
        this.get(LS_Constants.GOOGLE_ACCESS_TOKEN)
    )

    setGoogleAccessToken = (googleAccessToken: string) => {
        this.set(LS_Constants.GOOGLE_ACCESS_TOKEN, googleAccessToken)
    }

    removeGoogleAccessToken = () => {
        this.remove(LS_Constants.GOOGLE_ACCESS_TOKEN)
    }

    getEmail = () : string | null => (
        this.get(LS_Constants.EMAIL)
    )

    setEmail = (email: string) => {
        this.set(LS_Constants.EMAIL, email)
    }

    removeEmail = () => {
        this.remove(LS_Constants.EMAIL)
    }

    getName = (): string => (
        this.convertStringOrNullToString(this.get(LS_Constants.NAME))
    )

    setName = (name: string) => {
        this.set(LS_Constants.NAME, name)
    } 

    removeName = () => {
        this.remove(LS_Constants.NAME)
    }

    getPictureUrl = (): string => (
        this.convertStringOrNullToString(this.get(LS_Constants.PICTURE_URL))
    )
    
    setPictureUrl = (pictureUrl: string) => {
        this.set(LS_Constants.PICTURE_URL, pictureUrl)
    }

    removePictureUrl = () => {
        this.remove(LS_Constants.PICTURE_URL)
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

    private convertStringOrNullToString = (nullableString: string | null): string => (
        nullableString ? nullableString : ''
    )
    
}

export default new LocalStorageService()