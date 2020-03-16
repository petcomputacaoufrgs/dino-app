import LocalStorageKeysConstants from "../constants/LocalStorageKeysConstants"


/**
 * @description Auxilia a gravar e ler valores do local storage
 */
class LocalStorageService {
    private get(key: string) : string | null {
        return localStorage.getItem(key)
    }

    private set(key: string, value: string) {
        if (!key || !value) {
            throw Error("Invalid Key or Value!")
        } else {
            return localStorage.setItem(key, value)
        } 
    }

    /**
     * @description Retorna o código de autenticação se houver
     */
    getAuthToken() : string | null {
        return this.get(LocalStorageKeysConstants.AUTH_TOKEN)
    }

    /**
     * @description Salva um novo valor como código de autenticação
     * @param accessToken valor do token de acesso a ser salvo
     */
    setAuthToken(accessToken: string) {
        this.set(LocalStorageKeysConstants.AUTH_TOKEN, accessToken)
    }
}

export default new LocalStorageService()