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
            throw Error("Chave inválida!")
        } else {
            return localStorage.setItem(key, value)
        } 
    }

    /**
     * @description Retorna o código de autenticação se houver
     */
    getAuthToken = () : string => {
        const authToken = this.get(LocalStorageKeysConstants.AUTH_TOKEN)
        
        return this.stringOrNullToString(authToken)
    }

    /**
     * @description Salva um novo valor como código de autenticação
     * @param accessToken valor do token de acesso a ser salvo
     */
    setAuthToken = (accessToken: string) => {
        this.set(LocalStorageKeysConstants.AUTH_TOKEN, accessToken)
    }

    /**
     * @description Retorna o email do usuário caso esteja salvo
     */
    getEmail = () : string | null => {
        return this.get(LocalStorageKeysConstants.EMAIL)
    }

    /**
     * @description Salva o email do usuário para acesso futuro
     * @param email email do usuário a ser salvo
     */
    setEmail = (email: string) => {
        this.set(LocalStorageKeysConstants.EMAIL, email)
    }

    /**
     * @description Retorna o nome do usuário atual
     */
    getName = (): string | null => {
        return this.get(LocalStorageKeysConstants.NAME)
    }

    /**
     * @description Salva o nome do usuário atual
     */
    setName = (name: string) => {
        this.set(LocalStorageKeysConstants.NAME, name)
    } 

    /**
     * @description Salva a imagem do usuário (url)
     */
    getPictureUrl = (): string | null => {
        return this.get(LocalStorageKeysConstants.PICTURE_URL)
    }
    
    /**
     * @description Retorna a imagem do usuário (url) caso esteja salva
     */
    setPictureUrl = (pictureUrl: string) => {
        this.set(LocalStorageKeysConstants.PICTURE_URL, pictureUrl)
    }

    /**
     * @description Recebe um valor do tipo string ou null e retorna uma string sempre.
     * Caso o valor seja null retorna uma string vazia
     */
    private stringOrNullToString = (nullableString: string | null): string => {
        return nullableString ? nullableString : ''
    }


}

export default new LocalStorageService()