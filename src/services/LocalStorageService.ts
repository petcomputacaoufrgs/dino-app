import LS_Constants from "../constants/LocalStorageKeysConstants"
import GlossaryItemModel from '../model/GlossaryItemModel'

/**
 * @description Auxilia a gravar e ler valores do local storage
 * Quando o objeto não for uma string é necessário o stringify caso contrário não é possível acessar os dados
 */
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

    setGlossaryVersion = (version: number) => {
        this.set(LS_Constants.GLOSSARY_VERSION, JSON.stringify(version))
    }

    setGlossaryItems = (items: GlossaryItemModel[]) => {
        this.set(LS_Constants.GLOSSARY_ITEMS, JSON.stringify(items))
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

    private convertStringOrNullToString = (nullableString: string | null): string => (
        nullableString ? nullableString : ''
    )
}

export default new LocalStorageService()