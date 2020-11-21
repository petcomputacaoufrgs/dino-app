import Superagent from 'superagent'
import AuthService from '../services/auth/AuthService'
import GoogleAPIHeaderConstants from '../constants/google/GoogleAPIHeaderConstants'
import BaseAgent from './BaseAgent'
import DinoAPIURLConstants from '../constants/dino_api/DinoAPIURLConstants'
import DinoAgentService from './DinoAgentService'
import GoogleRefreshAuthResponseModel from '../types/auth/google/GoogleRefreshAuthResponseModel'
import LogAppErrorService from '../services/log_app_error/LogAppErrorService'
import sleep from '../utils/SleepUtils'

const TIME_MARGIN_OF_ERROR_IN_MS = 300000
const TIME_TO_AWAIT_FOR_REFRESHED_TOKEN = 500

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
        //if (AuthService.isRefreshingAccessToken()) {
        return this.awaitForRefreshedToken()
      } else {
        return this.refreshAuthToken()
      }
    }

    return false
  }

  private awaitForRefreshedToken = async (): Promise<boolean> => {
    while (AuthService.isRefreshingGoogleAccessToken()) {
      await sleep(TIME_TO_AWAIT_FOR_REFRESHED_TOKEN)
    }

    const success = AuthService.successRefreshingGoogleAccessToken()

    return success
  }

  private refreshAuthToken = async (): Promise<boolean> => {
    AuthService.startRefreshingGoogleAccessToken()

    const request = await DinoAgentService.get(
      DinoAPIURLConstants.REFRESH_AUTH_GOOGLE
    )

    if (request.canGo) {
      try {
        const response = await request.authenticate().go()
        const googleAuth: GoogleRefreshAuthResponseModel = response.body
        AuthService.setGoogleAccessToken(googleAuth.googleAccessToken)
        AuthService.setGoogleExpiresDate(googleAuth.googleExpiresDate)
        AuthService.stopRefreshingGoogleAccessToken(true)
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }

    AuthService.stopRefreshingGoogleAccessToken(false)
    return false
  }

  private needsUpdateToken = (expiresDate: number): boolean => {
    const expiresDateWithMargin = expiresDate - TIME_MARGIN_OF_ERROR_IN_MS

    const nowInMS = new Date().getDate()

    return expiresDateWithMargin <= nowInMS
  }
}

export default new GoogleAgentService()
