import Superagent, { Response } from 'superagent'
import HttpStatus from 'http-status-codes'
import DinoAPIHeaderConstants from '../../../constants/dino_api/DinoAPIHeaderConstants'
import AuthService from '../../auth/AuthService'
import EventsService from '../../events/EventsService'
import BaseAgent from '../../../types/services/agent/BaseAgent'

/**
 * @description Adapta a biblioteca Superagent para lidar com a DinoAPI
 */
class DinoAgentService extends BaseAgent {

  protected filterWhileCreating = (request: Superagent.SuperAgentRequest): Superagent.SuperAgentRequest => {
    request.set(this.getHeader())
    return request
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
      return { [DinoAPIHeaderConstants.AUTHORIZATION]: token }
    }

    return {}
  }

  protected onError = (err: any) => {
    if (err.status === HttpStatus.FORBIDDEN) {
      EventsService.whenLoginForbidden()
    } else if (err.status === HttpStatus.PRECONDITION_REQUIRED) {
      AuthService.setRefreshRequiredToTrue()
    }
  }

  protected onResponse = (response: Response) => {
    const verifyDinoAuth = () => {
      const newToken = response.get(DinoAPIHeaderConstants.REFRESH_TOKEN)

      if (newToken) {
        AuthService.setAuthToken(newToken)
      }
    }

    const verifyGoogleAuth = () => {
      const newGoogleToken = response.get(
        DinoAPIHeaderConstants.GOOGLE_REFRESH_TOKEN
      )

      if (newGoogleToken) {
        const newExpiresDate = response.get(DinoAPIHeaderConstants.GOOGLE_EXPIRES_DATE)
        AuthService.setGoogleAccessToken(newGoogleToken)
        AuthService.setGoogleExpiresDate(JSON.parse(newExpiresDate))
      }
    }

    if (response.status === HttpStatus.OK) {
      verifyDinoAuth()
      verifyGoogleAuth()
    }
  }
}

export default new DinoAgentService()
