import AuthRequestModel from '../model/AuthRequestModel'
import Superagent from 'superagent'
import HttpStatus from 'http-status-codes'
import DinoApiConstants from '../constants/DinoApiConstants'
import {GoogleLoginResponseOffline} from 'react-google-login'
import LocalStorageService from './LocalStorageService'
import AuthResponseModel from '../model/AuthResponseModel'

class AuthService {

    /**
     * @description Valida o login do usuário com a API e requere o token de acesso
     * @param loginResponse valor retornado pela API do GoogleOAuth com modo de login 'code'
     */
    login = async (loginResponse: GoogleLoginResponseOffline) => {
        if (loginResponse.code) { //Caso haja um token de autenticação
            const authRequestModel = new AuthRequestModel(loginResponse.code)
            const response = await Superagent.post(DinoApiConstants.PATH_AUTH_GOOGLE).send(authRequestModel)
            
            if (response.status === HttpStatus.OK) {
                const responseBody: AuthResponseModel = response.body

                LocalStorageService.setAuthToken(responseBody.accessToken)
            }
        }    
        /** @todo Melhorar erros de tela de login */
        alert('Erro na autenticação com a API do Dino')
    }

    /**
     * @description Verifica se o usuário está autenticado baseado no LocalStorage
     */
    isAuthenticated = () => (
        Boolean(LocalStorageService.getAuthToken())
    )
}

export default new AuthService()