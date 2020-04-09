import LS_Constants from "../constants/LocalStorageKeysConstants"

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
    getGlossaryVersion = () : string => {
        let glossary = this.getGlossary
        return glossary ? glossary[LS_Constants.GLOSSARY_VERSION] : ''   
    }

    getGlossaryItems = () : string => {
        let glossary = this.getGlossary
        return glossary ? glossary[LS_Constants.GLOSSARY_ITEMS] : ''  
    }

    getGlossary = () : string | null => {
        return localStorage.getItem(LS_Constants.GLOSSARY)
    }

    setGlossary = (glossary : string) => {
        this.set(LS_Constants.GLOSSARY, glossary)
    }
}

export default new LocalStorageService()