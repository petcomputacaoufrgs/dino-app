import Superagent from 'superagent'
import AuthService from '../../auth/AuthService'
import GoogleAPIHeaderConstants from '../../../constants/google/GoogleAPIHeaderConstants'
import BaseAgent from '../../../types/services/agent/BaseAgent'
import DinoAPIURLConstants from '../../../constants/dino_api/DinoAPIURLConstants'
import DinoAgentService from '../dino/DinoAgentService'
import AgentStatus from '../../../types/services/agent/AgentStatus'
import GoogleRefreshAuthResponseModel from '../../../types/auth/google/GoogleRefreshAuthResponseModel'

const TIME_MARGIN_OF_ERROR_IN_MS = 300000

/**
 * @description Adapta a biblioteca Superagent para lidar com a GoogleAPI
 */
class GoogleAgentService extends BaseAgent {
  protected filterBeforeCreate = async () => {
    const success = this.updateGoogleAccessTokenIfNecessary()

    return success
  }

  protected filterWhileCreating = (
    request: Superagent.SuperAgentRequest
  ): Superagent.SuperAgentRequest => {
    request.set(this.getHeader())

    return request
  }

  private getGoogleAccessToken = (): string | null =>
    AuthService.getGoogleAccessToken()

  private isAuthenticated = (): boolean => Boolean(this.getGoogleAccessToken())

  private getHeader = (): object => {
    let forceAuth = false

    if (this.isAuthenticated() || forceAuth) {
      const token = this.getGoogleAccessToken()

      return { [GoogleAPIHeaderConstants.AUTHORIZATION]: `Bearer ${token}` }
    }

    return {}
  }

  private updateGoogleAccessTokenIfNecessary = async (): Promise<boolean> => {
    const expiresDate = AuthService.getGoogleExpiresDate()

    if (expiresDate) {
      if (this.needsUpdateToken(expiresDate)) {
        const request = await DinoAgentService.get(
          DinoAPIURLConstants.REFRESH_AUTH_GOOGLE
        )

        if (request.status === AgentStatus.OK) {
          try {
            const response = await request.get()!
            const googleAuth: GoogleRefreshAuthResponseModel = response.body
            AuthService.setGoogleAccessToken(googleAuth.googleAccessToken)
            AuthService.setGoogleExpiresDate(googleAuth.googleExpiresDate)
          } catch {
            /**TO-DO Fazer log do erro */
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
