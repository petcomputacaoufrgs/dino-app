import AuthRequestModel from '../model/AuthRequestModel'
import HttpStatus from 'http-status-codes'
import DinoURLConstants from '../constants/DinoURLConstants'
import {GoogleLoginResponseOffline} from 'react-google-login'
import LocalStorageService from './LocalStorageService'
import AuthResponseModel from '../model/AuthResponseModel'
import HttpService from './HttpService'
import HistoryService from './HistoryService'
import PathConstants from '../constants/PathConstants'

class AuthService {

    /**
     * @description Valida o login do usuário com a API e requere o token de acesso
     * @param loginResponse valor retornado pela API do GoogleOAuth com modo de login 'code'
     */
    login = async (loginResponse: GoogleLoginResponseOffline) => {
        if (loginResponse.code) { //Caso haja um token de autenticação
            const authRequestModel = new AuthRequestModel(loginResponse.code)

            const response = await HttpService.post(DinoURLConstants.PATH_AUTH_GOOGLE).send(authRequestModel)
            
            if (response.status === HttpStatus.OK) {
                const responseBody: AuthResponseModel = response.body

                /* Salva o token de autenticação*/
                LocalStorageService.setAuthToken(responseBody.accessToken)

                /* Redireciona para a página principal */
                HistoryService.push(PathConstants.HOME)

                return
            }
        }    
        /** @todo Melhorar erros de tela de login */
        alert('Erro na autenticação com a API do Dino')
    }

    /**
     * @description Realiza o logout do usuário na aplicação
     */
    logout = async () => {
        const response = await HttpService.put(DinoURLConstants.PATH_SIGNOUT_GOOGLE)

        if(response.status === HttpStatus.OK) {
            LocalStorageService.setAuthToken('')

            return
        }
        
        /** @todo Melhorar erros no botão de logout */
        alert('Erro ao deslogar com a sua conta na API do Dino')
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