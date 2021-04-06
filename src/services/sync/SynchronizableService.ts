import PermissionEnum from '../../types/enum/AuthEnum'
import SyncResolve from '../../types/sync/SyncResolve'
import AuthService from '../auth/AuthService'
import WebSocketSubscriberableService from '../websocket/WebSocketSubscriberableService'
import SyncService from './SyncService'

export default abstract class SynchronizableService extends WebSocketSubscriberableService {
	/**
	 * @description Return a list of dependencies for synchronization.
	 * A service will await for its dependencies to be syncronized.
	 * A dependencie occurs whenever an synchronizable entity has reference for another (the seconds needs to be synchronized first).
	 * A dependencie can be used for another reasons.
	 * A sync dependency is also a websocket dependency, in other words, if service A is dependent of services B and C and a
	 * websocket request arrive for any method in A, B and C so the service A's callback will only be called after B and C callback are completed.
	 */
	abstract getSyncDependencies(): SynchronizableService[]

	/**
	 * @description Return list of necessary authorities to perform sync process.
	 * An user with anyone of this authorities can sync.
	 */
	abstract getSyncNecessaryPermissions(): PermissionEnum[] 

	/**
	 * @description Function that performs save data synchronization with the API.
	 */
	protected abstract sync(): Promise<boolean>

	/**
	 * @description Function that performs delete data synchronization with the API.
	 */
	protected abstract syncDelete(): Promise<boolean>

	/**
	 * @description Override to add new dependencies for websocket.
	 * A websocket dependencie occurs when any websocket function of another service needs to be completed to call one of this service.
	 * A SynchronizableService is websocket dependent of itself and of this sync dependencies services.
	 */
	protected onGetWebSocketDependencies(): WebSocketSubscriberableService[] {
		return []
	}

	/**
	 * @description Function called on logout
	 */
	protected async onLogout(): Promise<void> {}

	private isSynchronizing: boolean

	private syncResult: boolean | undefined

	private syncResolves: SyncResolve[]

	constructor() {
		super()
		this.isSynchronizing = false
		this.syncResolves = []
		this.subscribeInSyncService()
		this.subscribeLogoutCallback()
	}

	/**
	 * @description Need to be called for finish sync process to not cause conflict with the next sync.
	 */
	finishSync = () => {
		this.syncResult = undefined
	}

	/**
	 * @description Start synchronization process to save entities
	 */
	async synchronizeSave(): Promise<boolean> {
		if (this.syncResult !== undefined) {
			return this.syncResult
		} else if (this.isSynchronizing) {
			return new Promise<boolean>(resolve => {
				this.syncResolves.push(resolve)
			})
		} else {
			this.isSynchronizing = true
			const result = await this.sync()
			this.syncResult = result
			this.isSynchronizing = false
			this.resolveAllAfterReturn(result)
			return result
		}
	}

	/**
	 * @description Start synchronization process to delete entites
	 */
	async synchronizeDelete(): Promise<boolean> {
		if (this.syncResult !== undefined) {
			return this.syncResult
		} else if (this.isSynchronizing) {
			return new Promise<boolean>(resolve => {
				this.syncResolves.push(resolve)
			})
		} else {
			this.isSynchronizing = true
			const result = await this.syncDelete()
			this.syncResult = result
			this.isSynchronizing = false
			this.resolveAllAfterReturn(result)
			return result
		}
	}

	/**
	 * @description return default WebSocket dependencies for synchronizable service.
	 * To add more dependencies use onGetWebSocketDependencies function.
	 */
	protected getWebSocketDependencies(): WebSocketSubscriberableService[] {
		const webSocketDependencies: WebSocketSubscriberableService[] = []
		webSocketDependencies.push(...this.getSyncDependencies())
		webSocketDependencies.push(...this.onGetWebSocketDependencies())
		webSocketDependencies.push(this)

		return webSocketDependencies
	}

	private subscribeInSyncService = () => {
		window.addEventListener('load', () => SyncService.subscribeService(this))
	}

	private subscribeLogoutCallback = () => {
		window.addEventListener('load', () =>
			AuthService.subscribeAuthenticatedService(this.onLogout),
		)
	}

	private resolveAllAfterReturn = (result: boolean) => {
		setTimeout(() => this.resolveAll(result), 0)
	}

	private resolveAll(result: boolean) {
		this.syncResolves.forEach(resolve => resolve(result))
		this.cleanResolveList()
	}

	private cleanResolveList() {
		this.syncResolves = []
	}
}
