import Superagent from 'superagent'
import AuthService from '../services/auth/AuthService'
import GoogleAPIHeaderConstants from '../constants/google/GoogleAPIHeaderConstants'
import BaseAgent from './BaseAgent'
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
    return AuthService.refreshGoogleAccessToken()
  }

  private needsUpdateToken = (expiresDate: number): boolean => {
    const expiresDateWithMargin = expiresDate - TIME_MARGIN_OF_ERROR_IN_MS

    const nowInMS = new Date().getTime()

    return expiresDateWithMargin <= nowInMS
  }
}

export default new GoogleAgentService()
