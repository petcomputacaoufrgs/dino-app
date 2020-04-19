import GoogleAuthRequestModel from '../model/GoogleAuthRequestModel'
import HttpStatus from 'http-status-codes'
import DinoAPIURLConstants from '../constants/DinoAPIURLConstants'
import { GoogleLoginResponseOffline } from 'react-google-login'
import LocalStorageService from './LocalStorageService'
import AuthResponseModel from '../model/AuthResponseModel'
import HttpService from './DinoHttpService'
import HistoryService from './HistoryService'
import PathConstants from '../constants/PathConstants'
import UpdateService from './UpdateService'
import GoogleAuthConstants from '../constants/GoogleAuthConstants'
import LoginErrorTypes from '../constants/LoginErrorTypes'
import GoogleAuthResponseModel from '../model/GoogleAuthResponseModel';

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
        Boolean(LocalStorageService.getAuthToken())
    )

    getAuthenticationToken = () : string => {
        return LocalStorageService.getAuthToken()
    }

    private saveGoogleAuthDataFromRequestBody(responseBody: GoogleAuthResponseModel) {
        LocalStorageService.setGoogleAccessToken(responseBody.googleAccessToken)
        this.saveUserAuthDataFromRequestBody(responseBody)
    }

    private saveUserAuthDataFromRequestBody(responseBody: AuthResponseModel) {
        LocalStorageService.setAuthToken(responseBody.accessToken)
        LocalStorageService.setEmail(responseBody.email)
        LocalStorageService.setName(responseBody.name)
        LocalStorageService.setPictureUrl(responseBody.pictureUrl)
    }
    
    public removeAuthData() {
        LocalStorageService.removeAuthToken()
        LocalStorageService.removeGoogleAccessToken()
        LocalStorageService.removeEmail()
        LocalStorageService.removeName()
        LocalStorageService.removePictureUrl()
    }
}

export default new GoogleAuthService()