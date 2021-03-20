import Superagent from 'superagent'
import DinoAPIHeaderConstants from '../constants/api/APIHeaderConstants'
import AuthService from '../services/auth/AuthService'
import EventService from '../services/events/EventService'
import BaseAgent from './BaseAgent'
import AuthEntity from '../types/auth/database/AuthEntity'
import HttpStatus from '../types/http/HttpStatus'
import DinoPermission from '../types/auth/api/DinoPermissions'
import ResponsibleAuthService from '../services/auth/ResponsibleAuthService'
import { AgentRequestInfo } from '../types/agent/AgentRequest'

class DinoAgentService extends BaseAgent<AuthEntity, DinoPermission> {
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

	async hasPermissions(permissions: DinoPermission[]): Promise<boolean> {
		return AuthService.hasPermissions(permissions)
	}

	async addPermissions(requestInfo: AgentRequestInfo, permissions: DinoPermission[]): Promise<AgentRequestInfo> {
		const modifyRequests = permissions.map(async permission => {
			switch(permission) {
				case 'responsable':
					const code = await ResponsibleAuthService.getCode()
					if (code) {
						requestInfo.request.set(DinoAPIHeaderConstants.RESPONSIBLE_CODE, code)
					}
					break
				default:
					break
			}
		})

		await Promise.all(modifyRequests)

		return requestInfo
	}

	protected addAuth(
		request: Superagent.SuperAgentRequest,
		auth: AuthEntity,
	): Superagent.SuperAgentRequest {
		const token = auth.dinoAccessToken

		if (token) {
			request.set(DinoAPIHeaderConstants.AUTHORIZATION, token)
		}

		return request
	}

	protected onError = (err: any) => {
		if (err.status === HttpStatus.FORBIDDEN) {
			EventService.whenForbidden()
		}
	}
}

export default new DinoAgentService()
