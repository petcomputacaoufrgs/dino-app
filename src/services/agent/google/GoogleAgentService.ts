import Superagent from 'superagent'
import AuthService from '../../auth/AuthService'
import GoogleAPIHeaderConstants from '../../../constants/google/GoogleAPIHeaderConstants'
import BaseAgent from '../../../types/services/agent/BaseAgent'

/**
 * @description Adapta a biblioteca Superagent para lidar com a GoogleAPI
 */
class GoogleAgentService extends BaseAgent {
  
  protected filter = (request: Superagent.SuperAgentRequest): Superagent.SuperAgentRequest => {
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
}

export default new GoogleAgentService()
