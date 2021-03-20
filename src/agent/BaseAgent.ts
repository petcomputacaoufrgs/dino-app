import Superagent from 'superagent'
import AgentRequest, { AgentRequestInfo } from '../types/agent/AgentRequest'
import ConnectionService from '../services/connection/ConnectionService'
import SleepUtils from '../utils/SleepUtils'

type AgentResolve<AUTH> = (
	value: AUTH | undefined | PromiseLike<AUTH | undefined>,
) => void

const TIME_MARGIN_OF_ERROR_IN_MS = 300000

export default abstract class BaseAgent<AUTH, PERMISSION> {
	private refreshingAuth: boolean
	private resolves: AgentResolve<AUTH>[]

	constructor() {
		this.refreshingAuth = false
		this.resolves = []
	}

	/**
	 * Called to get the current auth
	 */
	abstract getAuth(): Promise<AUTH | undefined>

	/**
	 * Method to refresh agent auth
	 */
	abstract refreshAuth(): Promise<AUTH | undefined>

	/**
	 * Called when refresh fails
	 */
	abstract getTokenExpiresDate(auth: AUTH): Date | undefined

	/**
	 * Return true if user has valid authentication
	 */
	abstract isAuthenticated(auth: AUTH): boolean

	/**
	 * Return true if user has the requested permission
	 * @param permissions list of defined permissions
	 */
	abstract hasPermissions(permissions: PERMISSION[]): Promise<boolean>

	/**
	 * Return request with additional header for permissions if necessary
	 * @param permissions 
	 */
	abstract addPermissions(requestInfo: AgentRequestInfo,
		permissions: PERMISSION[]): Promise<AgentRequestInfo>

	/**
	 * Override to add authentication on request
	 * @param request return request with authentication
	 */
	protected addAuth(
		request: Superagent.SuperAgentRequest,
		auth: AUTH,
	): Superagent.SuperAgentRequest {
		return request
	}

	/**
	 * Called when an error occur
	 */
	protected onError = (err: any) => {}

	/**
	 * Called when resposta return
	 */
	protected onResponse = (response: Superagent.Response) => {}

	/**
	 * Called after send the request, in this step you can add data to request
	 * @param request return request
	 */
	protected filterWhileCreating = (
		request: Superagent.SuperAgentRequest,
	): Superagent.SuperAgentRequest => {
		return request
	}

	put = async (url: string): Promise<AgentRequest<PERMISSION>> => {
		const request = this.filterWhileCreating(
			Superagent.put(url)
				.on('error', this.onError)
				.on('response', this.onResponse),
		)

		return this.getAgentRequest({
			request: request,
			hasPermission: true,
			canGo: true
		})
	}

	patch = async (url: string): Promise<AgentRequest<PERMISSION>> => {
		const request = this.filterWhileCreating(
			Superagent.patch(url)
				.on('error', this.onError)
				.on('response', this.onResponse),
		)

		return this.getAgentRequest({
			request: request,
			hasPermission: true,
			canGo: true
		})
	}

	post = async (url: string): Promise<AgentRequest<PERMISSION>> => {
		const request = this.filterWhileCreating(
			Superagent.post(url)
				.on('error', this.onError)
				.on('response', this.onResponse),
		)

		return this.getAgentRequest({
			request: request,
			hasPermission: true,
			canGo: true
		})
	}

	get = async (url: string): Promise<AgentRequest<PERMISSION>> => {
		const request = this.filterWhileCreating(
			Superagent.get(url)
				.on('error', this.onError)
				.on('response', this.onResponse),
		)

		return this.getAgentRequest({
			request: request,
			hasPermission: true,
			canGo: true
		})
	}

	delete = async (url: string): Promise<AgentRequest<PERMISSION>> => {
		const request = this.filterWhileCreating(
			Superagent.delete(url)
				.on('error', this.onError)
				.on('response', this.onResponse),
		)

		return this.getAgentRequest({
			request: request,
			hasPermission: true,
			canGo: true
		})
	}

	private getUpdatedAuth = async (): Promise<AUTH | undefined> => {
		const auth = await this.getAuth()

		if (!auth) return

		const isAuthenticated = this.isAuthenticated(auth)

		if (!isAuthenticated) return

		const expiresDate = this.getTokenExpiresDate(auth)

		if (expiresDate) {
			const isExpired = this.isExpired(expiresDate)
			if (isExpired) {
				return this.awaitRefreshAuth()
			}
		}

		return auth
	}

	private isExpired = (expiresDate: Date): boolean => {
		const expiresDateWithMargin =
			expiresDate.getTime() - TIME_MARGIN_OF_ERROR_IN_MS

		const nowInMS = new Date().getTime()

		return expiresDateWithMargin <= nowInMS
	}

	private awaitRefreshAuth = async (): Promise<AUTH | undefined> => {
		if (this.refreshingAuth) {
			return new Promise<AUTH | undefined>(resolve => {
				this.resolves.push(resolve)
			})
		} else {
			this.refreshingAuth = true

			const auth = await this.refreshAuth()

			this.refreshingAuth = false

			this.resolveAllAfterReturn(auth)

			return auth
		}
	}

	private resolveAllAfterReturn = async (auth: AUTH | undefined) => {
		await SleepUtils.sleep(0)
		this.resolves.forEach(resolve => resolve(auth))
		this.resolves = []
	}

	private setBody = (
		info: AgentRequestInfo,
		body: string | object,
	): AgentRequest<PERMISSION> => {
		info.request.send(body)
		return this.getAgentRequest(info)
	}

	private addHeader = (
		info: AgentRequestInfo,
		key: string,
		value: string,
	): AgentRequest<PERMISSION> => {
		info.request.set(key, value)
		return this.getAgentRequest(info)
	}

	private authenticate = async (
		info: AgentRequestInfo,
		permissions?: PERMISSION[]
	): Promise<void> => {
		const auth = await this.getUpdatedAuth()

		if (auth) {
			info.request = this.addAuth(info.request, auth)
			if (permissions && permissions.length > 0) {
				this.permissions(info, permissions)
			}
		} else {
			info.canGo = false
		}
	}

	private permissions = async (info: AgentRequestInfo, permissions: PERMISSION[]): Promise<void> => {
		const hasPermissions = await this.hasPermissions(permissions)
 
		if (hasPermissions) {
			await this.addPermissions(info, permissions)
		} else {
			info.hasPermission = false
		}
	}

	private canGo(info: AgentRequestInfo) {
		if (info.canGo) {
			return ConnectionService.isConnected()
		}

		return false
	}

	private getAgentRequest = (info: AgentRequestInfo): AgentRequest<PERMISSION> => {
		return {
			go: async (): Promise<Superagent.Response> => await info.request,
			canGo: this.canGo(info),
			authenticate: (permissions?: PERMISSION[]) => this.authenticate(info, permissions),
			addPermission: (permission: PERMISSION) => this.permissions(info, [permission]),
			setBody: (body: string | object) => this.setBody(info, body),
			addHeader: (key: string, value: string) => this.addHeader(info, key, value),
			hasPermissions: info.hasPermission
		}
	}
}