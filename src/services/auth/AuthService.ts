import GoogleAuthRequestModel from '../../types/auth/GoogleAuthRequestModel'
import HttpStatus from 'http-status-codes'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import { GoogleLoginResponseOffline } from 'react-google-login'
import AuthLocalStorage from './local_storage/AuthLocalStorage'
import AuthResponseModel from '../../types/auth/AuthResponseModel'
import GoogleAuthConstants from '../../constants/GoogleAuthConstants'
import LoginErrorConstants from '../../constants/LoginErrorConstants'
import GoogleAuthResponseModel from '../../types/auth/GoogleAuthResponseModel'
import UserService from '../user/UserService'
import DinoAgentService from '../dino_agent/DinoAgentService'
import DinoAgentStatus from '../../types/dino_agent/DinoAgentStatus'
import EventsService from '../events/EventsService'

class AuthService {
  getDefaultScopes = (): string => {
    return (
      GoogleAuthConstants.SCOPE_CALENDAR +
      ' ' +
      GoogleAuthConstants.SCOPE_PROFILE
    )
  }

  googleLogin = async (
    loginResponse: GoogleLoginResponseOffline
  ): Promise<number> => {
    if (loginResponse.code) {
      const authRequestModel = new GoogleAuthRequestModel(loginResponse.code)

      try {
        const request = DinoAgentService.post(DinoAPIURLConstants.AUTH_GOOGLE)

        if (request.status === DinoAgentStatus.OK) {
          const response = await request.get().send(authRequestModel)

          if (response.status === HttpStatus.OK) {
            AuthLocalStorage.cleanLoginGarbage()
            this.setRefreshRequiredToFalse()

            this.saveGoogleAuthDataFromRequestBody(response.body as GoogleAuthResponseModel)

            EventsService.whenLogin()

            return LoginErrorConstants.SUCCESS
          }

          if (response.status === HttpStatus.NON_AUTHORITATIVE_INFORMATION) {
            this.setRefreshRequiredToTrue()
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

  googleLogout = () => {
    const authToken = AuthLocalStorage.getAuthToken()

    this.APILogout(authToken)

    EventsService.whenLogout()
  }

  APILogout = async (authToken: string): Promise<boolean> => {
    try {
      const request = DinoAgentService.logout(authToken)

      if (request.status === DinoAgentStatus.OK) {
        await request.get()

        return true
      }
    } catch {
      /* TO-DO Salvar erro */
    }

    AuthLocalStorage.setLogoutToken(authToken)

    return false
  }

  getLogoutToken = (): string => {
    return AuthLocalStorage.getLogoutToken()
  }

  removeLogoutToken = () => {
    AuthLocalStorage.removeLogoutToken()
  }

  shouldSync = (): boolean => {
    const tokenToLogout = AuthLocalStorage.getLogoutToken()

    return Boolean(tokenToLogout)
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
