import Superagent, { Response } from 'superagent'
import HttpStatus from 'http-status-codes'
import HistoryService from '../history/HistoryService'
import PathConstants from '../../constants/PathConstants'
import DinoAPIHeaderConstants from '../../constants/dino_api/DinoAPIHeaderConstants'
import AuthService from '../auth/AuthService'
import ConnectionService from '../connection/ConnectionService'
import DinoAgentRequest from '../../types/dino_agent/DinoAgentRequest'
import DinoAgentStatus from '../../types/dino_agent/DinoAgentStatus'
import UserService from '../user/UserService'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'

/**
 * @description Abstrai a biblioteca Superagent com tratamentos para conexão,autenticação, erro de autenticação e renovação de token
 */
class DinoAgentService {

  logout = (token: string): DinoAgentRequest => {
    const request = Superagent.put(DinoAPIURLConstants.LOGOUT)
      .set(this.getHeader(token))
      .on('error', this.onError)
      .on('response', this.onResponse)

    return this.getDinoAgentRequest(request)
  }

  put = (url: string): DinoAgentRequest => {
    const request = Superagent.put(url)
      .set(this.getHeader())
      .on('error', this.onError)
      .on('response', this.onResponse)

    return this.getDinoAgentRequest(request)
  }

  post = (url: string): DinoAgentRequest => {
    const request = Superagent.post(url)
      .set(this.getHeader())
      .on('error', this.onError)
      .on('response', this.onResponse)

    return this.getDinoAgentRequest(request)
  }

  get = (url: string): DinoAgentRequest => {
    const request = Superagent.get(url)
      .set(this.getHeader())
      .on('error', this.onError)
      .on('response', this.onResponse)

    return this.getDinoAgentRequest(request)
  }

  delete = (url: string): DinoAgentRequest => {
    const request = Superagent.delete(url)
      .set(this.getHeader())
      .on('error', this.onError)
      .on('response', this.onResponse)

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

  private getAuthToken = (): string => AuthService.getAuthToken()

  private isAuthenticated = (): boolean => Boolean(this.getAuthToken())

  private getHeader = (token?: string): object => {
    let forceAuth = false

    if (!token) {
      token = this.getAuthToken()
    } else {
      forceAuth = true
    }

    if (this.isAuthenticated() || forceAuth) {
      const authorizationHeader = 'Bearer '.concat(token)

      return { [DinoAPIHeaderConstants.AUTHORIZATION]: authorizationHeader }
    }

    return {}
  }

  private onError = (err: any) => {
    if (err.status === HttpStatus.FORBIDDEN) {
      UserService.removeUserData()

      HistoryService.push(PathConstants.LOGIN)
    } else if (err.status === HttpStatus.PRECONDITION_REQUIRED) {
      AuthService.setRefreshRequiredToTrue()
    }
  }

  private onResponse = (response: Response) => {
    const verifyDinoAuth = () => {
      const newToken = response.get(DinoAPIHeaderConstants.REFRESH_TOKEN)

      if (newToken) {
        AuthService.setAuthToken(newToken.substring(7))
      }
    }

    const verifyGoogleAuth = () => {
      const newGoogleToken = response.get(
        DinoAPIHeaderConstants.GOOGLE_REFRESH_TOKEN
      )

      if (newGoogleToken) {
        AuthService.setGoogleAccessToken(newGoogleToken.substring(7))
      }
    }

    if (response.status === HttpStatus.OK) {
      verifyDinoAuth()
      verifyGoogleAuth()
    }
  }
}

export default new DinoAgentService()
