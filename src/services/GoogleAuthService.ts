import AuthRequestModel from '../model/AuthRequestModel'
import HttpStatus from 'http-status-codes'
import DinoAPIURLConstants from '../constants/DinoAPIURLConstants'
import {GoogleLoginResponseOffline} from 'react-google-login'
import LocalStorageService from './LocalStorageService'
import AuthResponseModel from '../model/AuthResponseModel'
import HttpService from './DinoHttpService'
import HistoryService from './HistoryService'
import PathConstants from '../constants/PathConstants'
import GoogleScopeConstants from '../constants/GoogleScopeConstants'
import LoginErrorTypes from '../constants/LoginErrorTypes'

class GoogleAuthService {

    /**
     * @description Retorna uma string com os escopos padrões da autenticação com o Google
     */
    getDefaultScopes = (): string => {
        return GoogleScopeConstants.CALENDAR + ' ' +
                GoogleScopeConstants.PROFILE
    }

    /**
     * @description Valida o login do usuário com a API e requere o token de acesso
     * @param loginResponse valor retornado pela API do GoogleOAuth com modo de login 'code'
     */
    login = async (loginResponse: GoogleLoginResponseOffline): Promise<number> => {
        if (loginResponse.code) {
            const authRequestModel = new AuthRequestModel(loginResponse.code)

            const response = await HttpService.post(DinoAPIURLConstants.PATH_AUTH_GOOGLE).send(authRequestModel)
            
            if (response.status === HttpStatus.OK) {                
                this.saveResponseBodyData(response.body as AuthResponseModel)

                /* Redireciona para a página principal */
                HistoryService.push(PathConstants.HOME)

                return LoginErrorTypes.API_ERROR
            }
        }    
        
        return LoginErrorTypes.EXTERNAL_SERVICE_ERROR
    }

    /**
     * @description Realiza o logout do usuário
     */
    logout = () => {
        this.removeUserData()

        HistoryService.push(PathConstants.LOGIN)
    }

    /**
     * @description Verifica se o usuário está autenticado baseado no LocalStorage
     */
    isAuthenticated = () : boolean => (
        Boolean(LocalStorageService.getAuthToken())
    )

    /**
     * @description Retorna o token de autenticação
     */
    getAuthenticationToken = () : string => {
        return LocalStorageService.getAuthToken()
    }

    /**
     * @description Salva os dados de retorno para acesso futuro
     * @param responseBody Retorno da requisição
     */
    private saveResponseBodyData(responseBody: AuthResponseModel) {
        LocalStorageService.setAuthToken(responseBody.accessToken)
        LocalStorageService.setGoogleAccessToken(responseBody.googleAccessToken)
        LocalStorageService.setEmail(responseBody.email)
        LocalStorageService.setName(responseBody.name)
        LocalStorageService.setPictureUrl(responseBody.pictureUrl)
    }
    
    /**
     * @description Remove os dados do usuário salvos
     */
    private removeUserData() {
        LocalStorageService.removeAuthToken()
        LocalStorageService.removeGoogleAccessToken()
        LocalStorageService.removeEmail()
        LocalStorageService.removeName()
        LocalStorageService.removePictureUrl()
    }
}

export default new GoogleAuthService()