import Superagent from 'superagent'
import GoogleAuthRequestModel from '../../types/auth/google/api/GoogleAuthRequestModel'
import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import AuthResponseDataModel from '../../types/auth/api/AuthResponseModel'
import LoginStatusConstants from '../../constants/login/LoginStatusConstants'
import UserService from '../user/UserService'
import DinoAgentService from '../../agent/DinoAgentService'
import EventService from '../events/EventService'
import LogAppErrorService from '../log_app_error/LogAppErrorService'
import WebSocketAuthResponseModel from '../../types/auth/web_socket/WebSocketAuthResponseModel'
import GoogleOAuth2Service from './google/GoogleOAuth2Service'
import GoogleGrantRequestModel from '../../types/auth/google/api/GoogleGrantRequestModel'
import GrantStatusConstants from '../../constants/login/GrantStatusConstants'
import GoogleScope from '../../types/auth/google/GoogleScope'
import GoogleRefreshAuthResponseModel from '../../types/auth/google/api/GoogleRefreshAuthResponseModel'
import GoogleScopeService from './google/GoogleScopeService'
import GoogleAuthResponseDataModel from '../../types/auth/google/api/GoogleAuthResponseDataModel'
import GoogleAuthResponseModel from '../../types/auth/google/api/GoogleAuthResponseModel'
import GoogleAuthErrorCode from '../../types/auth/google/api/GoogleAuthErrorCode'
import GoogleRefreshAuthResponseDataModel from '../../types/auth/google/api/GoogleRefreshAuthResponseDataModel'
import AuthRefreshRequestModel from '../../types/auth/api/AuthRefreshRequestModel'
import AuthRefreshResponseModel from '../../types/auth/api/AuthRefreshResponseModel'
import DateUtils from '../../utils/DateUtils'
import AuthEntity from '../../types/auth/database/AuthEntity'
import AuthContextUpdater from '../../context/updater/AuthContextUpdater'
import AuthenticatedService from './AuthenticatedService'
import Database from '../../storage/database/Database'

class AuthService {
  private authenticatedServices: AuthenticatedService[]
  private table: Dexie.Table<AuthEntity, number>

  constructor() {
    this.authenticatedServices = []
    this.table = Database.auth
  }

  subscribeAuthenticatedService = (service: AuthenticatedService) => {
    this.authenticatedServices.push(service)
  }

  requestGoogleLogin = async (forceConsent: boolean, email?: string): Promise<[number, string | undefined]> => {
    try {
      const code = await GoogleOAuth2Service.requestLogin(forceConsent, email)
      if (code) {
        return this.requestGoogleLoginOnDinoAPI(code)
      }
      return [LoginStatusConstants.EXTERNAL_SERVICE_ERROR, undefined]
    } catch (e) {
      return [LoginStatusConstants.REQUEST_CANCELED, undefined]
    }
  }

  requestGoogleGrant = async (
    scopeList: GoogleScope[],
    refreshTokenNecessary: boolean,
    email: string
  ): Promise<[number, string | undefined]> => {
    try {
      const authCode = await GoogleOAuth2Service.requestGrant(
        scopeList,
        email,
        refreshTokenNecessary
      )

      if (authCode) {
        return this.requestGoogleGrantOnDinoAPI(authCode, scopeList)
      }

      return [GrantStatusConstants.EXTERNAL_SERVICE_ERROR, undefined]
    } catch (e) {
      LogAppErrorService.logError(e)
      return [GrantStatusConstants.REQUEST_CANCELED, undefined]
    }
  }

  refreshGoogleAuth = async (): Promise<AuthEntity | undefined> => {
    const request = await DinoAgentService.get(
      APIRequestMappingConstants.REFRESH_AUTH_GOOGLE
    )
    if (request.canGo) {
      try {
        const authRequest = await request.authenticate()
        const response = await authRequest.go()
        const responseBody: GoogleRefreshAuthResponseModel = response.body

        if (responseBody.success) {
          return this.saveGoogleRefreshAuthData(responseBody.data)
        } else {
          await this.logout()
        }
        
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }
  }

  refreshDinoAuth = async (): Promise<AuthEntity | undefined> => {
    try {
      const auth = await this.getAuth()

      if (auth === undefined || !auth.dinoAccessToken) {
        return
      }

      const model: AuthRefreshRequestModel = {
        refreshToken: auth.dinoRefreshToken,
      }

      const response = await Superagent.put(
        APIRequestMappingConstants.REFRESH_AUTH
      ).send(model)

      const responseBody: AuthRefreshResponseModel = response.body

      if (responseBody.success) {
        const auth = await this.getAuth()
        const expiresDate = DateUtils.convertDinoAPIStringDateToDate(responseBody.data.expiresDate)

        if (auth) {
          auth.dinoAccessToken = responseBody.data.accessToken
          auth.dinoExpiresDate = expiresDate
          await this.dbSave(auth)
          return auth
        } 
      }

      await this.logout()
    } catch (e) {
      LogAppErrorService.logError(e)
    }
  }

  requestWebSocketAuthToken = async (): Promise<
    WebSocketAuthResponseModel | undefined
  > => {
    const request = await DinoAgentService.get(
      APIRequestMappingConstants.WEB_SOCKET_AUTH
    )
    if (request.canGo) {
      try {
        const authRequest = await request.authenticate()
        const response = await authRequest.go()
        return response.body
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    } else {
      return undefined
    }
  }

  logout = async () => {
    await this.dbClear()

    const onLogoutCallbacks = this.authenticatedServices.map(service => {
      return service.onLogout()
    })

    await Promise.all(onLogoutCallbacks)

    AuthContextUpdater.update()

    EventService.whenLogout()
  }

  isAuthenticated = async (): Promise<boolean> => {
    const entity = await this.getAuth()

    return entity !== undefined
  }

  isAuthenticatedWithGoogle = async (): Promise<boolean> => {
    const auth = await this.getAuth()

    return auth !== undefined && auth.googleToken !== undefined
  }

  getAuth = async() : Promise<AuthEntity | undefined> => {
    const all = await this.table.toArray()
        
    if (all.length > 0) {
      return all[0]
    }
  }

  private dbSave = async (entity: AuthEntity) => {
    const id = await this.table.put(entity)
        
    entity.id = id
  }

  private dbClear = async () => {
    await this.table.clear()
  }

  private requestGoogleLoginOnDinoAPI = async (
    code: string
  ): Promise<[number, string | undefined]> => {
    const authRequestModel: GoogleAuthRequestModel = {
      code: code,
    }

    try {
      const request = await DinoAgentService.post(
        APIRequestMappingConstants.AUTH_GOOGLE
      )
      if (request.canGo) {
        const response = await request.setBody(authRequestModel).go()

        const body: GoogleAuthResponseModel = response.body

        if (body.success) {
          await this.saveGoogleAuthData(body.data)
          AuthContextUpdater.update()
          EventService.whenLogin()
          return [LoginStatusConstants.SUCCESS, undefined]
        }

        if (body.errorCode === GoogleAuthErrorCode.REFRESH_TOKEN) {
          return [LoginStatusConstants.REFRESH_TOKEN_NECESSARY, body.error]
        } 

        if (body.errorCode === GoogleAuthErrorCode.EXCEPTION) {
          return [LoginStatusConstants.UNKNOW_API_ERROR, undefined]
        }
      }
      return [LoginStatusConstants.DISCONNECTED, undefined]
    } catch (e) {
      LogAppErrorService.logError(e)
      return [LoginStatusConstants.UNKNOW_API_ERROR, undefined]
    }
  }

  private requestGoogleGrantOnDinoAPI = async (
    code: string,
    scopeList: string[]
  ): Promise<[number, string | undefined]> => {
    const grantRequestModel: GoogleGrantRequestModel = {
      code: code,
      scopeList: scopeList,
    }

    try {
      const request = await DinoAgentService.post(
        APIRequestMappingConstants.GRANT_GOOGLE
      )
      if (request.canGo) {
        const authRequest = await request.authenticate()
        const response = await authRequest.setBody(grantRequestModel).go()

        const responseBody: GoogleRefreshAuthResponseModel = response.body

        if (responseBody.success) {
          await this.saveGoogleRefreshAuthData(responseBody.data)
          return [GrantStatusConstants.SUCCESS, undefined]
        }
            
        if (responseBody.errorCode === GoogleAuthErrorCode.REFRESH_TOKEN) {
          return [GrantStatusConstants.REFRESH_TOKEN_NECESSARY, responseBody.error]
        } 

        if (responseBody.errorCode === GoogleAuthErrorCode.EXCEPTION) {
          return [GrantStatusConstants.UNKNOW_API_ERROR, undefined]
        }

        if (responseBody.errorCode === GoogleAuthErrorCode.INVALID_GOOGLE_GRANT_USER) {
          return [GrantStatusConstants.INVALID_ACCOUNT, responseBody.error]
        }
      }

      return [GrantStatusConstants.DISCONNECTED, undefined]
    } catch (e) {
      LogAppErrorService.logError(e)
      return [GrantStatusConstants.UNKNOW_API_ERROR, undefined]
    }
  }

  private async saveGoogleRefreshAuthData(
    responseBody: GoogleRefreshAuthResponseDataModel,
  ): Promise<AuthEntity | undefined> {
    const auth = await this.getAuth()
    const googleExpiresDate = DateUtils.convertDinoAPIStringDateToDate(responseBody.googleExpiresDate)

    if (auth) {
      auth.googleExpiresDate = googleExpiresDate
      auth.googleToken = responseBody.googleAccessToken
      await this.dbSave(auth)
      return auth
    } else {
      await this.logout()
    }

    if (responseBody.scopes && responseBody.scopes.length > 0) {
      await GoogleScopeService.clearDatabase()
      await GoogleScopeService.saveAllFromDataModel(responseBody.scopes)
    }
  }

  private async saveGoogleAuthData(responseBody: GoogleAuthResponseDataModel) {
    await this.dbClear()

    const googleExpiresDate = DateUtils.convertDinoAPIStringDateToDate(responseBody.googleExpiresDate)

    const dinoExpiresDate = DateUtils.convertDinoAPIStringDateToDate(responseBody.expiresDate)

    const auth: AuthEntity = {
      googleToken: responseBody.googleAccessToken,
      googleExpiresDate: googleExpiresDate,
      dinoAccessToken: responseBody.accessToken,
      dinoExpiresDate: dinoExpiresDate,
      dinoRefreshToken: responseBody.refreshToken
    }

    await this.dbSave(auth)

    if (responseBody.scopes && responseBody.scopes.length > 0) {
      await GoogleScopeService.clearDatabase()
      await GoogleScopeService.saveAllFromDataModel(responseBody.scopes)
    }

    await this.saveUserAuthData(responseBody)
  }

  private async saveUserAuthData(responseBody: AuthResponseDataModel) {
    await UserService.updateUser(responseBody.user)
  }
}

export default new AuthService()
