import Superagent from 'superagent'
import AuthService from '../auth/AuthService'
import ConnectionService from '../connection/ConnectionService'
import DinoAgentRequest from '../../types/dino_agent/DinoAgentRequest'
import DinoAgentStatus from '../../types/dino_agent/DinoAgentStatus'
import GoogleAPIHeaderConstants from '../../constants/google/GoogleAPIHeaderConstants'

/**
 * @description Adapta a biblioteca Superagent para lidar com a GoogleAPI
 */
class GoogleAgentService {
  put = (url: string): DinoAgentRequest => {
    const request = Superagent.put(url)
      .set(this.getHeader())
      .on('error', this.onError)

    return this.getDinoAgentRequest(request)
  }

  post = (url: string): DinoAgentRequest => {
    const request = Superagent.post(url)
      .set(this.getHeader())
      .on('error', this.onError)

    return this.getDinoAgentRequest(request)
  }

  get = (url: string): DinoAgentRequest => {
    const request = Superagent.get(url)
      .set(this.getHeader())
      .on('error', this.onError)

    return this.getDinoAgentRequest(request)
  }

  delete = (url: string): DinoAgentRequest => {
    const request = Superagent.delete(url)
      .set(this.getHeader())
      .on('error', this.onError)

    return this.getDinoAgentRequest(request)
  }

  private getDinoAgentRequest = (
    request: Superagent.SuperAgentRequest
  ): DinoAgentRequest => {
    if (ConnectionService.isConnected()) {
      return { get: () => request, status: DinoAgentStatus.OK }
    } else {
      return { get: () => request, status: DinoAgentStatus.DISCONNECTED }
    }
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

  private onError = (err: any) => {
    //TO-DO: request new google auth token
  }
}

export default new GoogleAgentService()
