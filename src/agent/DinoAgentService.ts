import Superagent from 'superagent'
import HttpStatus from 'http-status-codes'
import DinoAPIHeaderConstants from '../constants/dino_api/DinoAPIHeaderConstants'
import AuthService from '../services/auth/AuthService'
import EventService from '../services/events/EventService'
import BaseAgent from './BaseAgent'
import DinoAPIURLConstants from '../constants/dino_api/DinoAPIURLConstants'
import AuthRefreshRequestModel from '../types/auth/AuthRefreshRequestModel'
import AuthRefreshResponseModel from '../types/auth/AuthRefreshResponseModel'
import LogAppErrorService from '../services/log_app_error/LogAppErrorService'

const TIME_MARGIN_OF_ERROR_IN_MS = 300000

class DinoAgentService extends BaseAgent {
  protected filterBeforeCreate = async () => {
    const success = this.updateDinoAccessTokenIfNecessary()

    return success
  }

  protected addAuth = (
    request: Superagent.SuperAgentRequest
  ): Superagent.SuperAgentRequest => {
    const token = AuthService.getAuthToken()

    request.set(DinoAPIHeaderConstants.AUTHORIZATION, token)
    return request
  }

  protected onError = (err: any) => {
    if (err.status === HttpStatus.FORBIDDEN) {
      EventService.whenLoginForbidden()
    } else if (err.status === HttpStatus.PRECONDITION_REQUIRED) {
      AuthService.setRefreshRequiredToTrue()
    }
  }

  private updateDinoAccessTokenIfNecessary = async (): Promise<boolean> => {
    const isAuthenticated = AuthService.isAuthenticated()

    if (isAuthenticated) {
      const expiresDate = AuthService.getAuthTokenExpiresDate()

      if (this.needsUpdateToken(expiresDate)) {
        const model: AuthRefreshRequestModel = {
          accessToken: AuthService.getAuthToken(),
        }
        const response = await Superagent.put(
          DinoAPIURLConstants.REFRESH_AUTH
        ).send(model)
        if (response.status === HttpStatus.OK) {
          try {
            const refreshResponse: AuthRefreshResponseModel = response.body
            AuthService.setAuthToken(refreshResponse.accessToken)
            AuthService.setAuthTokenExpiresDate(refreshResponse.expiresDate)
          } catch (e) {
            LogAppErrorService.saveError(e)
            return false
          }
        }
      }

      return true
    }

    return true
  }

  private needsUpdateToken = (expiresDate: number): boolean => {
    const expiresDateWithMargin = expiresDate - TIME_MARGIN_OF_ERROR_IN_MS

    const nowInMS = new Date().getTime()

    return nowInMS >= expiresDateWithMargin
  }
}

export default new DinoAgentService()
