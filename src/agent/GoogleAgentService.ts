import Superagent from 'superagent'
import AuthService from '../services/auth/AuthService'
import GoogleAPIHeaderConstants from '../constants/google/GoogleAPIHeaderConstants'
import BaseAgent from './BaseAgent'
import DinoAPIURLConstants from '../constants/dino_api/DinoAPIURLConstants'
import DinoAgentService from './DinoAgentService'
import GoogleRefreshAuthResponseModel from '../types/auth/google/GoogleRefreshAuthResponseModel'
import LogAppErrorService from '../services/log_app_error/LogAppErrorService'

const TIME_MARGIN_OF_ERROR_IN_MS = 300000

class GoogleAgentService extends BaseAgent {
  protected filterBeforeCreate = async () => {
    const success = this.updateGoogleAccessTokenIfNecessary()

    return success
  }

  protected addAuth = (
    request: Superagent.SuperAgentRequest
  ): Superagent.SuperAgentRequest => {
    const token = this.getGoogleAccessToken()

    request.set(GoogleAPIHeaderConstants.AUTHORIZATION, `Bearer ${token}`)

    return request
  }

  private getGoogleAccessToken = (): string | null =>
    AuthService.getGoogleAccessToken()

  private updateGoogleAccessTokenIfNecessary = async (): Promise<boolean> => {
    const expiresDate = AuthService.getGoogleExpiresDate()

    if (expiresDate) {
      if (this.needsUpdateToken(expiresDate)) {
        const request = await DinoAgentService.get(
          DinoAPIURLConstants.REFRESH_AUTH_GOOGLE
        )

        if (request.canGo) {
          try {
            const response = await request.authenticate().go()
            const googleAuth: GoogleRefreshAuthResponseModel = response.body
            AuthService.setGoogleAccessToken(googleAuth.googleAccessToken)
            AuthService.setGoogleExpiresDate(googleAuth.googleExpiresDate)
          } catch (e) {
            LogAppErrorService.saveError(e)
            return false
          }
        }
      }

      return true
    }

    return false
  }

  private needsUpdateToken = (expiresDate: number): boolean => {
    const expiresDateWithMargin = expiresDate - TIME_MARGIN_OF_ERROR_IN_MS

    const nowInMS = new Date().getDate()

    return expiresDateWithMargin <= nowInMS
  }
}

export default new GoogleAgentService()
