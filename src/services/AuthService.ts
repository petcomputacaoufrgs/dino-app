import GoogleAuthRequestModel from '../model/dino_api/auth/GoogleAuthRequestModel'
import HttpStatus from 'http-status-codes'
import DinoAPIURLConstants from '../constants/dino_api/DinoAPIURLConstants'
import { GoogleLoginResponseOffline } from 'react-google-login'
import AuthLocalStorage from '../local_storage/AuthLocalStorage'
import AuthResponseModel from '../model/dino_api/settings/AuthResponseModel'
import DinoAgentService from './DinoAgentService'
import HistoryService from './HistoryService'
import PathConstants from '../constants/PathConstants'
import GoogleAuthConstants from '../constants/GoogleAuthConstants'
import LoginErrorConstants from '../constants/LoginErrorConstants'
import GoogleAuthResponseModel from '../model/dino_api/auth/GoogleAuthResponseModel'
import UserLocalStorage from '../local_storage/UserLocalStorage'
import UserService from './UserService'

class AuthService {

    getDefaultScopes = (): string => {
        return GoogleAuthConstants.SCOPE_CALENDAR + ' ' +
                GoogleAuthConstants.SCOPE_PROFILE
    }

    google_login = async (loginResponse: GoogleLoginResponseOffline): Promise<number> => {
        if (loginResponse.code) {
            const authRequestModel = new GoogleAuthRequestModel(loginResponse.code)
                
            try {
                const response = await DinoAgentService.post(DinoAPIURLConstants.AUTH_GOOGLE).send(authRequestModel)

                if (response.status === HttpStatus.OK) {
                    this.saveGoogleAuthDataFromRequestBody(response.body as GoogleAuthResponseModel)
    
                    AuthLocalStorage.cleanLoginGarbage()
    
                    return LoginErrorConstants.SUCCESS
                }

                if (response.status === HttpStatus.NON_AUTHORITATIVE_INFORMATION) {
                    return LoginErrorConstants.REFRESH_TOKEN_REFRESH_NECESSARY
                }

            } catch (error) {
                return LoginErrorConstants.UNKNOW_API_ERROR
            }
        }    
        
        return LoginErrorConstants.EXTERNAL_SERVICE_ERROR
    }

    google_logout = () => {
        UserService.removeUserData()

        HistoryService.push(PathConstants.LOGIN)
    }

    isAuthenticated = () : boolean => (
        Boolean(AuthLocalStorage.getAuthToken())
    )

    getAuthenticationToken = () : string => {
        return AuthLocalStorage.getAuthToken()
    }

    private saveGoogleAuthDataFromRequestBody(responseBody: GoogleAuthResponseModel) {
        AuthLocalStorage.setGoogleAccessToken(responseBody.googleAccessToken)
        this.saveUserAuthDataFromRequestBody(responseBody)
    }

    private saveUserAuthDataFromRequestBody(responseBody: AuthResponseModel) {
        AuthLocalStorage.setAuthToken(responseBody.accessToken)
        UserLocalStorage.setEmail(responseBody.email)
        UserLocalStorage.setName(responseBody.name)
        UserLocalStorage.setPictureUrl(responseBody.pictureUrl)
    }
    
}

export default new AuthService()