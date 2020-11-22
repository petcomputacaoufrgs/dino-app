import GoogleAuthRequestModel from '../../types/auth/google/GoogleAuthRequestModel'
import HttpStatus from 'http-status-codes'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import AuthLocalStorage from '../../local_storage/auth/AuthLocalStorage'
import AuthResponseModel from '../../types/auth/AuthResponseModel'
import LoginStatusConstants from '../../constants/login/LoginStatusConstants'
import GoogleAuthResponseModel from '../../types/auth/google/GoogleAuthResponseModel'
import UserService from '../user/UserService'
import DinoAgentService from '../../agent/DinoAgentService'
import EventService from '../events/EventService'
import LogAppErrorService from '../log_app_error/LogAppErrorService'
import WebSocketAuthResponseModel from '../../types/auth/web_socket/WebSocketAuthResponseModel'
import GoogleOAuth2Service from './google/GoogleOAuth2Service'
import GoogleGrantRequestModel from '../../types/auth/google/GoogleGrantRequestModel'
import GrantStatusConstants from '../../constants/login/GrantStatusConstants'
import GoogleScope from '../../types/auth/google/GoogleScope'
import GoogleRefreshAuthResponseModel from '../../types/auth/google/GoogleRefreshAuthResponseModel'

class AuthService {
  cleanLoginGarbage = () => {
    AuthLocalStorage.cleanLoginGarbage()
  }

  requestGoogleLogin = async (forceConsent: boolean): Promise<number> => {
    try {
      const code = await GoogleOAuth2Service.requestLogin(forceConsent)
      if (code) {
        return this.requestGoogleLoginOnDinoAPI(code)
      }
      return LoginStatusConstants.EXTERNAL_SERVICE_ERROR
    } catch (e) {
      return LoginStatusConstants.REQUEST_CANCELED
    }
  }

  requestGoogleGrant = async (scopeList: GoogleScope[]): Promise<number> => {
    const email = UserService.getEmail()
    try {
      const authCode = await GoogleOAuth2Service.requestGrant(scopeList, email)
      if (authCode) {
        return this.requestGoogleGrantOnDinoAPI(authCode, scopeList)
      }
      return GrantStatusConstants.EXTERNAL_SERVICE_ERROR
    } catch (e) {
      LogAppErrorService.logError(e)
      return GrantStatusConstants.REQUEST_CANCELED
    }
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
        LogAppErrorService.logError(e)
      }
    } else {
      return undefined
    }
  }

  googleLogout = () => {
    const authToken = this.getAuthToken()

    this.serverLogout(authToken)

    EventService.whenLogout()
  }

  serverLogout = async (authToken: string): Promise<boolean> => {
    try {
      const request = await DinoAgentService.put(DinoAPIURLConstants.LOGOUT)

      if (request.canGo) {
        await request.authenticate().go()

        return true
      }
    } catch (e) {
      LogAppErrorService.logError(e)
    }

    return false
  }

  refreshGoogleAccessToken = async (): Promise<boolean> => {
    this.startRefreshingGoogleAccessToken()
    const request = await DinoAgentService.get(
      DinoAPIURLConstants.REFRESH_AUTH_GOOGLE
    )
    if (request.canGo) {
      try {
        const response = await request.authenticate().go()
        this.saveGoogleRefreshAuthData(response.body)
        this.stopRefreshingGoogleAccessToken(true)
        return true
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }
    this.stopRefreshingGoogleAccessToken(false)
    return false
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

  getGoogleAuthScopes = (): string[] | null => {
    return AuthLocalStorage.getGoogleAuthScopes()
  }

  setGoogleAuthScopes = (scopeList: string[]) => {
    AuthLocalStorage.setGoogleAuthScopes(scopeList)
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

  private requestGoogleGrantOnDinoAPI = async (
    code: string,
    scopeList: string[]
  ): Promise<number> => {
    const grantRequestModel: GoogleGrantRequestModel = {
      code: code,
      scopeList: scopeList,
    }

    try {
      const request = await DinoAgentService.post(
        DinoAPIURLConstants.GRANT_GOOGLE
      )
      if (request.canGo) {
        const response = await request
          .authenticate()
          .setBody(grantRequestModel)
          .go()
        if (response.status === HttpStatus.OK) {
          this.saveGoogleRefreshAuthData(response.body)
          return GrantStatusConstants.SUCCESS
        }

        if (response.status === HttpStatus.NON_AUTHORITATIVE_INFORMATION) {
          return GrantStatusConstants.INVALID_ACCOUNT
        }

        if (response.status === HttpStatus.CONTINUE) {
          return GrantStatusConstants.REFRESH_TOKEN_NECESSARY
        }
      }
      return GrantStatusConstants.DISCONNECTED
    } catch (e) {
      LogAppErrorService.logError(e)
      return GrantStatusConstants.UNKNOW_API_ERROR
    }
  }

  private requestGoogleLoginOnDinoAPI = async (
    code: string
  ): Promise<number> => {
    const authRequestModel: GoogleAuthRequestModel = {
      code: code,
    }

    try {
      const request = await DinoAgentService.post(
        DinoAPIURLConstants.AUTH_GOOGLE
      )
      if (request.canGo) {
        const response = await request.setBody(authRequestModel).go()

        if (response.status === HttpStatus.OK) {
          AuthLocalStorage.cleanLoginGarbage()
          this.setRefreshRequiredToFalse()
          this.saveGoogleAuthData(response.body)
          EventService.whenLogin()
          return LoginStatusConstants.SUCCESS
        }
        if (response.status === HttpStatus.ACCEPTED) {
          this.setRefreshRequiredToTrue()
          return LoginStatusConstants.REFRESH_TOKEN_NECESSARY
        }
      }
      return LoginStatusConstants.DISCONNECTED
    } catch (e) {
      LogAppErrorService.logError(e)
      return LoginStatusConstants.UNKNOW_API_ERROR
    }
  }

  private saveGoogleRefreshAuthData(responseBody: GoogleRefreshAuthResponseModel) {
    this.setGoogleAccessToken(responseBody.googleAccessToken)
    this.setGoogleExpiresDate(responseBody.googleExpiresDate)
    this.setGoogleAuthScopes(responseBody.scopeList)
  }

  private saveGoogleAuthData(responseBody: GoogleAuthResponseModel) {
    this.setGoogleAccessToken(responseBody.googleAccessToken)
    this.setGoogleExpiresDate(responseBody.googleExpiresDate)
    this.setGoogleAuthScopes(responseBody.scopeList)
    this.saveUserAuthData(responseBody)
  }

  private saveUserAuthData(responseBody: AuthResponseModel) {
    AuthLocalStorage.setAuthToken(responseBody.accessToken)
    AuthLocalStorage.setAuthTokenExpiresDate(responseBody.expiresDate)
    UserService.saveUserDataFromModel(responseBody.user)
  }
}

export default new AuthService()
