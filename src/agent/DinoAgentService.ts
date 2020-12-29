import Superagent from 'superagent'
import HttpStatus from 'http-status-codes'
import DinoAPIHeaderConstants from '../constants/api/APIHeaderConstants'
import AuthService from '../services/auth/AuthService'
import EventService from '../services/events/EventService'
import BaseAgent from './BaseAgent'
import AuthEntity from '../types/auth/database/AuthEntity'

class DinoAgentService extends BaseAgent<AuthEntity> {
  getAuth(): Promise<AuthEntity | undefined> {
    return AuthService.getAuth()
  }

  refreshAuth(): Promise<AuthEntity | undefined> {
    return AuthService.refreshDinoAuth()
  }

  isAuthenticated(auth: AuthEntity): boolean {
    return auth !== undefined
  }

  getTokenExpiresDate(auth: AuthEntity): Date | undefined {
    return auth ? auth.dinoExpiresDate : undefined
  }

  protected addAuth(
    request: Superagent.SuperAgentRequest,
    auth: AuthEntity 
  ): Superagent.SuperAgentRequest {
    const token = auth.dinoAccessToken

    if (token) {
      request.set(DinoAPIHeaderConstants.AUTHORIZATION, token)
    }

    return request
  }

  protected onError = (err: any) => {
    if (err.status === HttpStatus.FORBIDDEN) {
      EventService.whenLoginForbidden()
    }
  }
}

export default new DinoAgentService()
