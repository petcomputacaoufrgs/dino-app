import GoogleAuthRequestModel from '../model/GoogleAuthRequestModel'
import HttpStatus from 'http-status-codes'
import DinoAPIURLConstants from '../constants/DinoAPIURLConstants'
import { GoogleLoginResponseOffline } from 'react-google-login'
import AuthLocalStorageService from './local_storage/AuthLocalStorageService'
import AuthResponseModel from '../model/AuthResponseModel'
import HttpService from './DinoHttpService'
import HistoryService from './HistoryService'
import PathConstants from '../constants/PathConstants'
import UpdateService from './UpdateService'
import GoogleAuthConstants from '../constants/GoogleAuthConstants'
import LoginErrorTypes from '../constants/LoginErrorTypes'
import GoogleAuthResponseModel from '../model/GoogleAuthResponseModel'
import GlossaryLocalStorageService from './local_storage/GlossaryLocalStorageService'
import UserAuthDataStorageService from './local_storage/UserAuthDataStorageService'
import SettingsLocalStorageService from './local_storage/SettingsLocalStorageService'

class GoogleAuthService {

    getDefaultScopes = (): string => {
        return GoogleAuthConstants.SCOPE_CALENDAR + ' ' +
                GoogleAuthConstants.SCOPE_PROFILE
    }

    google_login = async (loginResponse: GoogleLoginResponseOffline): Promise<number> => {
        if (loginResponse.code) {
            const authRequestModel = new GoogleAuthRequestModel(loginResponse.code)
                
            try {
                const response = await HttpService.post(DinoAPIURLConstants.PATH_AUTH_GOOGLE).send(authRequestModel)

                this.saveGoogleAuthDataFromRequestBody(response.body as GoogleAuthResponseModel)
    
                UpdateService.checkUpdates()
                HistoryService.push(PathConstants.HOME)
    
                return LoginErrorTypes.SUCCESS
            } catch (error){
                if (error.status === HttpStatus.PRECONDITION_REQUIRED) {
                    return LoginErrorTypes.REFRESH_TOKEN_LOST_ERROR
                } 

                return LoginErrorTypes.UNKNOW_API_ERROR
            }
        }    
        
        return LoginErrorTypes.EXTERNAL_SERVICE_ERROR
    }

    google_logout = () => {
        this.removeAuthData()

        HistoryService.push(PathConstants.LOGIN)
    }

    isAuthenticated = () : boolean => (
        Boolean(AuthLocalStorageService.getAuthToken())
    )

    getAuthenticationToken = () : string => {
        return AuthLocalStorageService.getAuthToken()
    }

    private saveGoogleAuthDataFromRequestBody(responseBody: GoogleAuthResponseModel) {
        AuthLocalStorageService.setGoogleAccessToken(responseBody.googleAccessToken)
        this.saveUserAuthDataFromRequestBody(responseBody)
    }

    private saveUserAuthDataFromRequestBody(responseBody: AuthResponseModel) {
        AuthLocalStorageService.setAuthToken(responseBody.accessToken)
        UserAuthDataStorageService.setEmail(responseBody.email)
        UserAuthDataStorageService.setName(responseBody.name)
        UserAuthDataStorageService.setPictureUrl(responseBody.pictureUrl)
    }
    
    public removeAuthData() {
        AuthLocalStorageService.removeAuthToken()
        AuthLocalStorageService.removeGoogleAccessToken()
        UserAuthDataStorageService.removeEmail()
        UserAuthDataStorageService.removeName()
        UserAuthDataStorageService.removePictureUrl()
        SettingsLocalStorageService.removeAppSettingsVersion()
        SettingsLocalStorageService.removeAppSettings()
        GlossaryLocalStorageService.removeGlossaryVersion()
        GlossaryLocalStorageService.removeGlossaryItems()
    }
}

export default new GoogleAuthService()