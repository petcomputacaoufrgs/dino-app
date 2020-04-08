import LocalStorageKeysConstants from "../constants/LocalStorageKeysConstants"

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
        const authToken = this.get(LocalStorageKeysConstants.AUTH_TOKEN)
        
        return authToken ? authToken : ''
    }

    /**
     * @description Salva um novo valor como código de autenticação
     * @param accessToken valor do token de acesso a ser salvo
     */
    setAuthToken = (accessToken: string) => {
        this.set(LocalStorageKeysConstants.AUTH_TOKEN, accessToken)
    }

    setGlossaryVersion = (glossaryVersion : string) => {
        this.set(LocalStorageKeysConstants.GLOSSARY_VERSION, glossaryVersion)
    }

    setGlossaryItems = (glossaryItems : string) => {
        this.set(LocalStorageKeysConstants.GLOSSARY_ITEMS, glossaryItems)
    }
}

export default new LocalStorageService()