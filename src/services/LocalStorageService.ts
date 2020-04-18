import LS_Constants from "../constants/LocalStorageKeysConstants"
import GlossaryItemModel from '../model/GlossaryItemModel';

/**
 * @description Auxilia a gravar e ler valores do local storage
 * Quando o objeto não for uma string é necessário o stringify caso contrário não é possível acessar os dados
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

    private remove = (key: string) => {
        if (!key) {
            throw Error("Chave inválida!")
        } else {
            return localStorage.setItem(key, '')
        } 
    }

    /**
     * @description Retorna o código de autenticação se houver
     */
    getAuthToken = () : string => {
        const authToken = this.get(LS_Constants.AUTH_TOKEN)
        
        return this.stringOrNullToString(authToken)
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

    /**
     * @description Limpa o token de autenticação
     */
    removeAuthToken = () => {
        this.remove(LS_Constants.AUTH_TOKEN)
    }

    /**
     * @description Busca o token de acesso do Google
     */
    getGoogleAccessToken = (): string | null => {
        return this.get(LS_Constants.GOOGLE_ACCESS_TOKEN)
    }

    /**
     * @description Salva um token de acesso do Google
     */
    setGoogleAccessToken = (googleAccessToken: string) => {
        this.set(LS_Constants.GOOGLE_ACCESS_TOKEN, googleAccessToken)
    }

    /**
     * @description Limpa o token de acesso do google
     */
    removeGoogleAccessToken = () => {
        this.remove(LS_Constants.GOOGLE_ACCESS_TOKEN)
    }

    /**
     * @description Retorna o email do usuário caso esteja salvo
     */
    getEmail = () : string | null => {
        return this.get(LS_Constants.EMAIL)
    }

    /**
     * @description Salva o email do usuário para acesso futuro
     * @param email email do usuário a ser salvo
     */
    setEmail = (email: string) => {
        this.set(LS_Constants.EMAIL, email)
    }

    /**
     * @description Remove o email salvo
     */
    removeEmail = () => {
        this.remove(LS_Constants.EMAIL)
    }

    /**
     * @description Retorna o nome do usuário atual
     */
    getName = (): string => {
        return this.stringOrNullToString(this.get(LS_Constants.NAME))
    }

    /**
     * @description Salva o nome do usuário atual
     */
    setName = (name: string) => {
        this.set(LS_Constants.NAME, name)
    } 

    /**
     * @description Remove o nome salvo
     */
    removeName = () => {
        this.remove(LS_Constants.NAME)
    }

    /**
     * @description Salva a imagem do usuário (url)
     */
    getPictureUrl = (): string => {
        return this.stringOrNullToString(this.get(LS_Constants.PICTURE_URL))
    }
    
    /**
     * @description Retorna a imagem do usuário (url) caso esteja salva
     */
    setPictureUrl = (pictureUrl: string) => {
        this.set(LS_Constants.PICTURE_URL, pictureUrl)
    }

    /**
     * @description Remove a URL da foto salva
     */
    removePictureUrl = () => {
        this.remove(LS_Constants.PICTURE_URL)
    }


    /**
     * @description Retorna o valor da linguagem do APP
     */
    getLanguage = (): string => (
        this.stringOrNullToString(this.get(LS_Constants.LANGUAGE))
    )

    /**
     * @description Salva o valor da linguagem do APP
     */
    setLanguage = (language: string) => {
        this.set(LS_Constants.LANGUAGE, language)
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