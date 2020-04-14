import LS_Constants from "../constants/LocalStorageKeysConstants"
import GlossaryItemModel from '../model/GlossaryItemModel';

/**
 * @description Auxilia a gravar e ler valores do local storage
 */
class LocalStorageService {
    private get = (key: string) : string | null => {
        return localStorage.getItem(key)
    }

    private set = (key: string, value: string) => {
        if (!key) {
            throw Error("Invalid Key or Value!")
        } else {
            return localStorage.setItem(key, value)
        } 
    }

    /**
     * @description Retorna o código de autenticação se houver
     */
    getAuthToken = () : string => {
        const authToken = this.get(LS_Constants.AUTH_TOKEN)
        
        return authToken ? authToken : ''
    }

    /**
     * @description Salva um novo valor como código de autenticação
     * @param accessToken valor do token de acesso a ser salvo
     */
    setAuthToken = (accessToken: string) => {
        this.set(LS_Constants.AUTH_TOKEN, accessToken)
    }

    /**
     * @description 
     * @param
     */
    getGlossaryVersion = () : number => {
        let version = this.get(LS_Constants.GLOSSARY_VERSION)

        return version ? Number(version) : -1   
    }

    getGlossaryItems = () : Array<GlossaryItemModel> => {
        let items = this.get(LS_Constants.GLOSSARY_ITEMS)
        
        return JSON.parse(items ? items : '')
    }

    setGlossaryVersion = (version : string) => {
        this.set(LS_Constants.GLOSSARY_VERSION, version)
    }

    setGlossaryItems = (items : string) => {
        this.set(LS_Constants.GLOSSARY_ITEMS, items)
    }
}

export default new LocalStorageService()