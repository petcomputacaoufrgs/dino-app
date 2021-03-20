import Superagent from 'superagent'
import AuthService from '../services/auth/AuthService'
import GoogleAPIHeaderConstants from '../constants/google/GoogleAPIHeaderConstants'
import BaseAgent from './BaseAgent'
import AuthEntity from '../types/auth/database/AuthEntity'
import GooglePermission from '../types/auth/service/GooglePermission'
import { AgentRequestInfo } from '../types/agent/AgentRequest'

class GoogleAgentService extends BaseAgent<AuthEntity, GooglePermission> {
	async getAuth(): Promise<AuthEntity | undefined> {
		return AuthService.getAuth()
	}

	async refreshAuth(): Promise<AuthEntity | undefined> {
		return AuthService.refreshGoogleAuth()
	}

	isAuthenticated(auth: AuthEntity): boolean {
		return auth !== undefined && Boolean(auth.googleToken)
	}

	getTokenExpiresDate(auth: AuthEntity): Date | undefined {
		return auth ? auth.googleExpiresDate : undefined
	}

	async hasPermissions(permissions: null[]): Promise<boolean> {
		return false
	}

	async addPermissions(
		requestInfo: AgentRequestInfo,
		permissions: null[]): Promise<AgentRequestInfo> {
		return requestInfo
	}

	protected addAuth(
		request: Superagent.SuperAgentRequest,
		auth: AuthEntity,
	): Superagent.SuperAgentRequest {
		const token = auth.googleToken

		if (token) {
			request.set(GoogleAPIHeaderConstants.AUTHORIZATION, `Bearer ${token}`)
		}

		return request
	}
}

export default new GoogleAgentService()
