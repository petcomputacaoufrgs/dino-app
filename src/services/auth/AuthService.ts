import GoogleAuthRequestModel from '../../types/auth/GoogleAuthRequestModel'
import HttpStatus from 'http-status-codes'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import { GoogleLoginResponseOffline } from 'react-google-login'
import AuthLocalStorage from './local_storage/AuthLocalStorage'
import AuthResponseModel from '../../types/auth/AuthResponseModel'
import HistoryService from '../history/HistoryService'
import PathConstants from '../../constants/PathConstants'
import GoogleAuthConstants from '../../constants/GoogleAuthConstants'
import LoginErrorConstants from '../../constants/LoginErrorConstants'
import GoogleAuthResponseModel from '../../types/auth/GoogleAuthResponseModel'
import UserService from '../user/UserService'
import DinoAgentService from '../dino_agent/DinoAgentService'
import DinoAgentStatus from '../../types/dino_agent/DinoAgentStatus'

class AuthService {
  getDefaultScopes = (): string => {
    return (
      GoogleAuthConstants.SCOPE_CALENDAR +
      ' ' +
      GoogleAuthConstants.SCOPE_PROFILE
    )
  }

  google_login = async (
    loginResponse: GoogleLoginResponseOffline
  ): Promise<number> => {
    if (loginResponse.code) {
      const authRequestModel = new GoogleAuthRequestModel(loginResponse.code)
      

      try {
        const request = DinoAgentService.post(DinoAPIURLConstants.AUTH_GOOGLE)

        if (request.status === DinoAgentStatus.OK) {
          const response = await request.get().send(authRequestModel)

          if (response.status === HttpStatus.OK) {
            this.saveGoogleAuthDataFromRequestBody(
              response.body as GoogleAuthResponseModel
            )

            AuthLocalStorage.cleanLoginGarbage()

            return LoginErrorConstants.SUCCESS
          }

          if (response.status === HttpStatus.NON_AUTHORITATIVE_INFORMATION) {
            return LoginErrorConstants.REFRESH_TOKEN_REFRESH_NECESSARY
          }
        }

        return LoginErrorConstants.DISCONNECTED
      } catch {
        /**TO-DO Faz log do erro */
        return LoginErrorConstants.UNKNOW_API_ERROR
      }
    }

    return LoginErrorConstants.EXTERNAL_SERVICE_ERROR
  }

  google_logout = () => {
    UserService.removeUserData()

    HistoryService.push(PathConstants.LOGIN)
  }

  isAuthenticated = (): boolean => Boolean(AuthLocalStorage.getAuthToken())

  setGoogleAccessToken = (token: string) => {
    AuthLocalStorage.setGoogleAccessToken(token)
  }

  setAuthToken = (token: string) => {
    AuthLocalStorage.setAuthToken(token)
  }

  getAuthToken = (): string => {
    return AuthLocalStorage.getAuthToken()
  }

  removeUserData = () => {
    AuthLocalStorage.removeUserData()
  }

  setRefreshRequiredToTrue = () => {
    AuthLocalStorage.setRefreshRequiredToTrue()
  }

  setRefreshRequiredToFalse = () => {
    AuthLocalStorage.setRefreshRequiredToFalse()
  }

  isRefreshRequired = (): boolean => AuthLocalStorage.isRefreshRequired()

  private saveGoogleAuthDataFromRequestBody(
    responseBody: GoogleAuthResponseModel
  ) {
    this.setGoogleAccessToken(responseBody.googleAccessToken)
    this.saveUserAuthDataFromRequestBody(responseBody)
  }

  private saveUserAuthDataFromRequestBody(responseBody: AuthResponseModel) {
    AuthLocalStorage.setAuthToken(responseBody.accessToken)
    UserService.setEmail(responseBody.email)
    UserService.setName(responseBody.name)
    UserService.setPictureUrl(responseBody.pictureUrl)
  }
}

export default new AuthService()
