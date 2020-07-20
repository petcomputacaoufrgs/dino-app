import Superagent from 'superagent'
import AuthService from '../auth/AuthService'
import GoogleAPIHeaderConstants from '../../constants/google/GoogleAPIHeaderConstants'
import AgentBase from '../../types/agent/AgentBase'

/**
 * @description Adapta a biblioteca Superagent para lidar com a GoogleAPI
 */
class GoogleAgentService extends AgentBase {
  
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
