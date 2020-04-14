import AuthRequestModel from '../model/AuthRequestModel'
import HttpStatus from 'http-status-codes'
import DinoAPIURLConstants from '../constants/DinoAPIURLConstants'
import {GoogleLoginResponseOffline} from 'react-google-login'
import LocalStorageService from './LocalStorageService'
import AuthResponseModel from '../model/AuthResponseModel'
import HttpService from './DinoHttpService'
import HistoryService from './HistoryService'
import PathConstants from '../constants/PathConstants'
import UpdateService from './UpdateService'

class AuthService {

    /**
     * @description Valida o login do usuário com a API e requere o token de acesso
     * @param loginResponse valor retornado pela API do GoogleOAuth com modo de login 'code'
     */
    login = async (loginResponse: GoogleLoginResponseOffline) => {
        if (loginResponse.code) { //Caso haja um token de autenticação
            const authRequestModel = new AuthRequestModel(loginResponse.code)

            const response = await HttpService.post(DinoAPIURLConstants.PATH_AUTH_GOOGLE).send(authRequestModel)
            
            if (response.status === HttpStatus.OK) {
                const responseBody: AuthResponseModel = response.body

                /* Salva o token de autenticação*/
                LocalStorageService.setAuthToken(responseBody.accessToken)

                /* Redireciona para a página principal */
                UpdateService.checkUpdates()
                HistoryService.push(PathConstants.HOME)

                return
            }
        }    
        /** @todo Melhorar erros de tela de login */
        alert('[AuthService login] Erro na autenticação com a API do Dino')
    }

    /**
     * @description Realiza o logout do usuário
     */
    logout = () => {
        LocalStorageService.setAuthToken('')

        /* Redireciona para a página de login */
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
}

export default new AuthService()