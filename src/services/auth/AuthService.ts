import GoogleAuthRequestModel from '../../types/auth/google/GoogleAuthRequestModel'
import HttpStatus from 'http-status-codes'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import { GoogleLoginResponseOffline } from 'react-google-login'
import AuthLocalStorage from '../../local_storage/auth/AuthLocalStorage'
import AuthResponseModel from '../../types/auth/AuthResponseModel'
import GoogleAuthConstants from '../../constants/google/GoogleAuthConstants'
import LoginErrorConstants from '../../constants/login/LoginErrorConstants'
import GoogleAuthResponseModel from '../../types/auth/google/GoogleAuthResponseModel'
import UserService from '../user/UserService'
import DinoAgentService from '../../agent/DinoAgentService'
import EventService from '../events/EventService'
import LogAppErrorService from '../log_app_error/LogAppErrorService'
import WebSocketAuthResponseModel from '../../types/auth/web_socket/WebSocketAuthResponseModel'

class AuthService {
  cleanLoginGarbage = () => {
    AuthLocalStorage.cleanLoginGarbage()
  }

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
        const request = await DinoAgentService.post(
          DinoAPIURLConstants.AUTH_GOOGLE
        )

        if (request.canGo) {
          const response = await request.setBody(authRequestModel).go()

          if (response.status === HttpStatus.OK) {
            AuthLocalStorage.cleanLoginGarbage()
            this.setRefreshRequiredToFalse()

            this.saveGoogleAuthDataFromRequestBody(
              response.body as GoogleAuthResponseModel
            )

            EventService.whenLogin()

            return LoginErrorConstants.SUCCESS
          }

          if (response?.status === HttpStatus.NON_AUTHORITATIVE_INFORMATION) {
            this.setRefreshRequiredToTrue()
            return LoginErrorConstants.REFRESH_TOKEN_REFRESH_NECESSARY
          }
        }

        return LoginErrorConstants.DISCONNECTED
      } catch (e) {
        LogAppErrorService.saveError(e)
        return LoginErrorConstants.UNKNOW_API_ERROR
      }
    }

    return LoginErrorConstants.EXTERNAL_SERVICE_ERROR
  }

  requestWebSocketAuthToken = async (): Promise<
    WebSocketAuthResponseModel | undefined
  > => {
    const request = await DinoAgentService.get(
      DinoAPIURLConstants.WEB_SOCKET_AUTH
    )
    if (request.canGo) {
      try {
        const response = await request.authenticate().go()
        return response.body
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    } else {
      return undefined
    }
  }

  googleLogout = async () => {
    await this.serverLogout()

    EventService.whenLogout()
  }

  serverLogout = async () => {
    try {
      const request = await DinoAgentService.put(DinoAPIURLConstants.LOGOUT)

      if (request.canGo) {
        request.authenticate().go()
      }
    } catch (e) {
      LogAppErrorService.saveError(e)
    }
  }

  isAuthenticated = (): boolean => Boolean(AuthLocalStorage.getAuthToken())

  getGoogleAccessToken = (): string | null => {
    return AuthLocalStorage.getGoogleAccessToken()
  }

  setGoogleAccessToken = (token: string) => {
    AuthLocalStorage.setGoogleAccessToken(token)
  }

  getGoogleExpiresDate = (): number | null => {
    return AuthLocalStorage.getGoogleExpiresDate()
  }

  setGoogleExpiresDate = (tokenExpiresDate: number) => {
    AuthLocalStorage.setGoogleExpiresDate(tokenExpiresDate)
  }

  getAuthToken = (): string => {
    return AuthLocalStorage.getAuthToken()
  }

  setAuthToken = (token: string) => {
    AuthLocalStorage.setAuthToken(token)
  }

  getAuthTokenExpiresDate = (): number =>
    AuthLocalStorage.getAuthTokenExpiresDate()

  setAuthTokenExpiresDate = (authTokenExpiresDate: number) => {
    AuthLocalStorage.setAuthTokenExpiresDate(authTokenExpiresDate)
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

  isRefreshingAccessToken = (): boolean =>
    AuthLocalStorage.isRefreshingAccessToken()

  startRefreshingAccessToken = () => {
    AuthLocalStorage.removeSuccessRefreshingAccessToken()
    AuthLocalStorage.setRefreshingAccessToken(true)
  }

  successRefreshingAccessToken = (): boolean => {
    return AuthLocalStorage.successRefreshingAccessToken()
  }

  stopRefreshingAccessToken = (success: boolean) => {
    AuthLocalStorage.setSuccessRefreshingAccessToken(success)
    AuthLocalStorage.setRefreshingAccessToken(false)
  }

  isRefreshingGoogleAccessToken = (): boolean =>
    AuthLocalStorage.isRefreshingGoogleAccessToken()

  startRefreshingGoogleAccessToken = () => {
    AuthLocalStorage.removeSuccessRefreshingGoogleAccessToken()
    AuthLocalStorage.setRefreshingGoogleAccessToken(true)
  }

  successRefreshingGoogleAccessToken = (): boolean => {
    return AuthLocalStorage.successRefreshingGoogleAccessToken()
  }

  stopRefreshingGoogleAccessToken = (success: boolean) => {
    AuthLocalStorage.setSuccessRefreshingGoogleAccessToken(success)
    AuthLocalStorage.setRefreshingGoogleAccessToken(false)
  }

  private saveGoogleAuthDataFromRequestBody(
    responseBody: GoogleAuthResponseModel
  ) {
    this.setGoogleAccessToken(responseBody.googleAccessToken)
    this.setGoogleExpiresDate(responseBody.googleExpiresDate)
    this.saveUserAuthDataFromRequestBody(responseBody)
  }

  private saveUserAuthDataFromRequestBody(responseBody: AuthResponseModel) {
    AuthLocalStorage.setAuthToken(responseBody.accessToken)
    AuthLocalStorage.setAuthTokenExpiresDate(responseBody.expiresDate)
    UserService.saveUserDataFromModel(responseBody.user)
  }
}

export default new AuthService()
