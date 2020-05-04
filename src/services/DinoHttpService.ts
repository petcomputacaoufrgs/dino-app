import Superagent, { Response } from 'superagent'
import AuthService from './AuthService'
import HttpStatus from 'http-status-codes'
import HistoryService from './HistoryService'
import PathConstants from '../constants/PathConstants'
import DinoAPIHeaderConstants from '../constants/dino_api/DinoAPIHeaderConstants'
import AuthLocalStorageService from './local_storage/AuthLocalStorageService'

/**
 * @description Abstrai a biblioteca Superagent com tratamentos para autenticação, erro de autenticação e renovação de token
 */
class DinoHttpService {

    /**
     * @description Cria uma requisição do tipo PUT com autenticação se houver e com filtro para erro de acesso negado
     * @param url URL da entrada de comunicação com a API
     */
    put = (url: string) : Superagent.SuperAgentRequest => {
        return Superagent.put(url).set(this.getHeader()).on('error', this.onError).on('response', this.onResponse)
    }

    /**
     * @description Cria uma requisição do tipo POST com autenticação se houver e com filtro para erro de acesso negado
     * @param url URL da entrada de comunicação com a API
     */
    post = (url: string) : Superagent.SuperAgentRequest => {
        return Superagent.post(url).set(this.getHeader()).on('error', this.onError).on('response', this.onResponse)
    }

    /**
     * @description Cria uma requisição do tipo GET com autenticação se houver e com filtro para erro de acesso negado
     * @param url URL da entrada de comunicação com a API
     */
    get = (url: string) : Superagent.SuperAgentRequest => {
        return Superagent.get(url).set(this.getHeader()).on('error', this.onError).on('response', this.onResponse)
    }

    /**
     * @description Cria uma requisição do tipo DELETE com autenticação se houver e com filtro para erro de acesso negado
     * @param url URL da entrada de comunicação com a API
     */
    delete = (url: string) : Superagent.SuperAgentRequest => {
        return Superagent.delete(url).set(this.getHeader()).on('error', this.onError).on('response', this.onResponse)
    }

    private getHeader = () : object => {
        if (AuthService.isAuthenticated()) {
            const authorizationHeader = 'Bearer '.concat(AuthService.getAuthenticationToken())

            return {[DinoAPIHeaderConstants.AUTHORIZATION]: authorizationHeader}
        }
        
        return {}
    }

    private onError = (err: any) => {
        if (err.status === HttpStatus.FORBIDDEN) {
            AuthService.removeUserData()

            HistoryService.push(PathConstants.LOGIN)
        } else if (err.status === HttpStatus.PRECONDITION_REQUIRED) {
            AuthLocalStorageService.setRefreshRequiredToTrue()
        }
    }

    private onResponse = (response: Response) => {
        const verifyDinoAuth = () => {
            const newToken = response.get(DinoAPIHeaderConstants.REFRESH_TOKEN)
            
            if (newToken) {
                AuthLocalStorageService.setAuthToken(newToken.substring(7))
            }   
        }

        const verifyGoogleAuth = () => {
            const newGoogleToken = response.get(DinoAPIHeaderConstants.GOOGLE_REFRESH_TOKEN)

            if (newGoogleToken) {
                AuthLocalStorageService.setAuthToken(newGoogleToken.substring(7))
            }
        }

        if (response.status === HttpStatus.OK) {
            verifyDinoAuth()
            verifyGoogleAuth()
        }
    }
}

export default new DinoHttpService()

