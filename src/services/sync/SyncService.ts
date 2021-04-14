import AuthService from '../auth/AuthService'
import SynchronizableService from './SynchronizableService'
import SyncTree, { SyncTreeNode } from './SyncTree'
import SyncStateEnum from '../../types/sync/SyncStateEnum'
import SyncResolve from '../../types/sync/SyncResolve'
import UpdatableService from '../update/UpdatableService'

const DELAY_RETRY_IN_MIN = 2

class SyncService extends UpdatableService {
	private tree: SyncTree

	private subscribedServices: SynchronizableService[]

	private syncState: SyncStateEnum

	private resolves: SyncResolve[]

	private retryTimeout: NodeJS.Timeout | undefined

	constructor() {
		super()
		this.tree = new SyncTree()
		this.subscribedServices = []
		this.syncState = SyncStateEnum.SYNCED
		this.resolves = []
		this.retryTimeout = undefined
	}

	onLogout = async () => {}

	sync = async (): Promise<boolean> => {
		const isAuthenticated = await AuthService.isAuthenticated()

		if (this.retryTimeout !== undefined) {
			clearTimeout(this.retryTimeout)
			this.retryTimeout = undefined
		}

		if (isAuthenticated) {
			const userPermissions = await AuthService.getPermissions()
			if (userPermissions) {
				if (this.syncState === SyncStateEnum.SYNCHRONIZING) {
					return new Promise<boolean>(resolve => {
						this.resolves.push(resolve)
					})
				} else {
					return this.doSync(userPermissions)
				}
			}
		}

		return true
	}

	subscribeService = (service: SynchronizableService) => {
		this.subscribedServices.push(service)
		this.tree.add(service)
	}

	getState = () => {
		return this.syncState
	}

	private doSync = async (userPermission: string[]): Promise<boolean> => {
		this.setSynchronizing()
		const result: boolean = await this.syncTree(userPermission)
		if (result) {
			this.setSynced()
		} else {
			this.setNotSynced()
			this.retrySync()
		}
		this.resolveAllAfterReturn(result)
		return result
	}

	private retrySync = () => {
		this.retryTimeout = setTimeout(
			() => this.sync(),
			DELAY_RETRY_IN_MIN * 60000,
		)
	}

	private resolveAllAfterReturn = (result: boolean) => {
		setTimeout(() => this.resolveAll(result), 0)
	}

	private resolveAll(result: boolean) {
		this.resolves.forEach(resolve => resolve(result))
		this.cleanResolveList()
	}

	private cleanResolveList() {
		this.resolves = []
	}

	private setSynchronizing = () => {
		this.syncState = SyncStateEnum.SYNCHRONIZING
		this.triggerUpdateEvent()
	}

	setNotSynced = () => {
		this.syncState = SyncStateEnum.NOT_SYNCED
		this.triggerUpdateEvent()
	}

	private setSynced = () => {
		this.syncState = SyncStateEnum.SYNCED
		this.triggerUpdateEvent()
	}

	private syncTree = async (userPermission: string[]): Promise<boolean> => {
		const deleteResult = await this.syncDelete(userPermission)
		const saveResult = await this.syncSave(userPermission)
		return deleteResult && saveResult
	}

	private syncSave = async (userPermission: string[]): Promise<boolean> => {
		const result = await this.syncNodesToSave(this.tree.saveRoot, userPermission)
		this.cleanServiceResults()
		return result
	}

	private syncDelete = async (userPermission: string[]): Promise<boolean> => {
		const result = await this.syncNodesToDelete(this.tree.deleteRoot, userPermission)
		this.cleanServiceResults()
		return result
	}

	private syncNodesToSave = async (
		nodes: SyncTreeNode[], 
		userPermission: string[]
	): Promise<boolean> => {
		const executionList = nodes.map(node => this.syncNodeToSave(node, userPermission))
		return this.processExecutionList(executionList)
	}

	private syncNodesToDelete = async (
		nodes: SyncTreeNode[],
		userPermission: string[]

	): Promise<boolean> => {
		const executionList = nodes.map(node => this.syncNodeToDelete(node, userPermission))
		return this.processExecutionList(executionList)
	}

	private syncNodeToSave = async (node: SyncTreeNode, userAuthorizations: string[]): Promise<boolean> => {
		const necessaryAuthorization = node.service.getSyncNecessaryPermissions()
        const hasNecessaryAuth = necessaryAuthorization.length === 0 || 
			userAuthorizations.some(uAuth => necessaryAuthorization.some(nAuth => nAuth === uAuth))
		
		if (!hasNecessaryAuth) return true

		const dependencies = node.dependencies
		if (dependencies.length > 0) {
			const executionList = dependencies.map(node => this.syncNodeToSave(node, userAuthorizations))
			const success = await this.processExecutionList(executionList)
			if (!success) return false
		}

		const result = await node.service.synchronizeSave()

		return result
	}

	private syncNodeToDelete = async (node: SyncTreeNode, userAuthorizations: string[]): Promise<boolean> => {
		const necessaryAuthorization = node.service.getSyncNecessaryPermissions()
        const hasNecessaryAuth = necessaryAuthorization.length === 0 ? true : 
			userAuthorizations.some(uAuth => necessaryAuthorization.some(nAuth => nAuth === uAuth))
		
		if (!hasNecessaryAuth) return true

		const dependents = node.dependents
		if (dependents.length > 0) {
			const executionList = dependents.map(node => this.syncNodeToDelete(node, userAuthorizations))
			const success = await this.processExecutionList(executionList)
			if (!success) return false
		}

		const result = await node.service.synchronizeDelete()

		return result
	}

	private processExecutionList = async (executionList: Promise<boolean>[]) => {
		const results = await Promise.all(executionList)
		return results.every(result => result)
	}

	private cleanServiceResults = () => {
		this.subscribedServices.forEach(service => service.finishSync())
	}
}

export default new SyncService()
