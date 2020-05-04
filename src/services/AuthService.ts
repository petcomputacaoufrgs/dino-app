import GoogleAuthRequestModel from '../model/dino_api/auth/GoogleAuthRequestModel'
import HttpStatus from 'http-status-codes'
import DinoAPIURLConstants from '../constants/dino_api/DinoAPIURLConstants'
import { GoogleLoginResponseOffline } from 'react-google-login'
import AuthLocalStorageService from './local_storage/AuthLocalStorageService'
import AuthResponseModel from '../model/dino_api/settings/AuthResponseModel'
import HttpService from './DinoHttpService'
import HistoryService from './HistoryService'
import PathConstants from '../constants/PathConstants'
import GoogleAuthConstants from '../constants/GoogleAuthConstants'
import LoginErrorConstants from '../constants/LoginErrorConstants'
import GoogleAuthResponseModel from '../model/dino_api/auth/GoogleAuthResponseModel'
import UserAuthDataStorageService from './local_storage/UserAuthDataStorageService'
import SettingsLocalStorageService from './local_storage/SettingsLocalStorageService'
import NotesLocalStorageService from './local_storage/NotesLocalStorageService'

class GoogleAuthService {

    getDefaultScopes = (): string => {
        return GoogleAuthConstants.SCOPE_CALENDAR + ' ' +
                GoogleAuthConstants.SCOPE_PROFILE
    }

    google_login = async (loginResponse: GoogleLoginResponseOffline): Promise<number> => {
        if (loginResponse.code) {
            const authRequestModel = new GoogleAuthRequestModel(loginResponse.code)
                
            try {
                const response = await HttpService.post(DinoAPIURLConstants.AUTH_GOOGLE).send(authRequestModel)

                if (response.status === HttpStatus.OK) {
                    this.saveGoogleAuthDataFromRequestBody(response.body as GoogleAuthResponseModel)
    
                    AuthLocalStorageService.cleanLoginGarbage()
    
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
        this.removeUserData()

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
    
    public removeUserData() {
        AuthLocalStorageService.removeUserData()
        UserAuthDataStorageService.removeUserData()
        SettingsLocalStorageService.removeUserData()
        NotesLocalStorageService.removeUserData()
    }
}

export default new GoogleAuthService()