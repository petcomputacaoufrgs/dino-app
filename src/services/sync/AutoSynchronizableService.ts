import { IndexableType } from 'dexie'
import DinoAgentService from '../../agent/DinoAgentService'
import LogAppErrorService from '../log_app_error/LogAppErrorService'
import SynchronizableDataResponseModel from '../../types/sync/api/response/SynchronizableDataResponseModel'
import SynchronizableDeleteModel from '../../types/sync/api/request/SynchronizableDeleteModel'
import SynchronizableListDataResponseModel from '../../types/sync/api/response/SynchronizableListDataResponseModel'
import SynchronizableSaveAllModel from '../../types/sync/api/request/SynchronizableSaveAllModel'
import SynchronizableDeleteAllListModel from '../../types/sync/api/request/SynchronizableDeleteAllListModel'
import SynchronizableEntity from '../../types/sync/database/SynchronizableEntity'
import SynchronizableLocalState from '../../types/sync/database/SynchronizableLocalState'
import SynchronizableWSUpdateModel from '../../types/sync/api/web_socket/SynchronizableWSUpdateModel'
import SynchronizableWSDeleteModel from '../../types/sync/api/web_socket/SynchronizableWSDeleteModel'
import SyncConstants from '../../constants/sync/SyncConstants'
import SynchronizableGenericDataResponseModel from '../../types/sync/api/response/SynchronizableGenericDataResponseModel'
import ArrayUtils from '../../utils/ArrayUtils'
import SynchronizableDataLocalIdModel from '../../types/sync/api/SynchronizableDataLocalIdModel'
import SynchronizableSyncModel from '../../types/sync/api/request/SynchronizableSyncModel'
import SynchronizableSyncResponseModel from '../../types/sync/api/response/SynchronizableSyncResponseModel'
import DateUtils from '../../utils/DateUtils'
import SynchronizableService from './SynchronizableService'
import WebSocketURLService from '../websocket/path/WebSocketPathService'
import WebSocketSubscriber from '../../types/web_socket/WebSocketSubscriber'
import Utils from '../../utils/Utils'
import DinoPermission from '../../types/auth/api/DinoPermissions'
import APITreatedResponse from '../../types/sync/APITreatedResponse'
import APITreatedResponseStatus from '../../types/sync/APITreatedResponseStatus'
import SynchronizableGenericResponseModel from '../../types/sync/api/response/SynchronizableGenericResponseModel'
import AuthService from '../auth/AuthService'

/**
 * @description Generic service with basic methods (save and delete) that auto synchronize entity with API
 * @param ID API synchronizable entity's id
 * @param DATA_MODEL synchronizable entity's data model
 * @param ENTITY local synchronizable entity
 * @param REPOSITORY local synchronizable entity's repository
 */
export default abstract class AutoSynchronizableService<
	ID extends IndexableType,
	DATA_MODEL extends SynchronizableDataLocalIdModel<ID>,
	ENTITY extends SynchronizableEntity<ID>
> extends SynchronizableService {
	protected apiBaseURL: string
	protected table: Dexie.Table<ENTITY, number>
	protected webSocketURLService: WebSocketURLService
	protected webSocketBaseURL: string

	constructor(
		table: Dexie.Table<ENTITY, number>,
		requestMapping: string,
		webSocketURLService: WebSocketURLService,
		webSocketBaseURL: string,
	) {
		super()
		this.apiBaseURL = requestMapping
		this.webSocketURLService = webSocketURLService
		this.webSocketBaseURL = webSocketBaseURL
		this.table = table
	}

	//#region METHODS THAT CAN BE OVERWRITTEN

	/**
	 * @description Override this function to do something when a websocket update is received
	 * @param model
	 */
	protected async onWebSocketUpdate(
		model: SynchronizableWSUpdateModel<ID, DATA_MODEL>,
	) {}

	/**
	 * @description Override this function to do something when a websocket delete is received
	 * @param model
	 */
	protected async onWebSocketDelete(model: SynchronizableWSDeleteModel<ID>) {}

	/**
	 * @description Override to add more subscribers to websocket connection
	 */
	onGetWebSocketSubscribers = (): WebSocketSubscriber<any>[] => {
		return []
	}

	//#endregion

	//#region CONVERSION MODEL <-> ENTITY

	/**
	 * @description Remember to transform model booleans into number (0,1) to save on database
	 * @param model api data_model
	 */
	abstract convertModelToEntity(model: DATA_MODEL): Promise<ENTITY | undefined>

	/**
	 * @param entity local entity
	 */
	abstract convertEntityToModel(entity: ENTITY): Promise<DATA_MODEL | undefined>

	/**
	 * Return list of permissions to access this data on DinoAPI
	 */
	protected abstract getDinoPermissions(): DinoPermission[]

	private async internalConvertModelToEntity(
		model: DATA_MODEL,
	): Promise<ENTITY | undefined> {
		const entity = await this.convertModelToEntity(model)

		if (entity) {
			entity.id = model.id
			entity.lastUpdate = DateUtils.convertDinoAPIStringDateToDate(
				model.lastUpdate!,
			)

			if (Utils.isNotEmpty(model.localId)) {
				entity.localId = model.localId
			} else if (Utils.isNotEmpty(model.id)) {
				const savedEntity = await this.dbGetById(model.id!)

				if (savedEntity) {
					entity.localId = savedEntity.localId
				}
			}

			return entity
		}
	}

	private async internalConvertEntityToModel(
		entity: ENTITY,
	): Promise<DATA_MODEL | undefined> {
		const model = await this.convertEntityToModel(entity)

		if (model) {
			model.id = entity.id
			model.lastUpdate = DateUtils.convertDateToDinoAPIStringDate(
				entity.lastUpdate!,
			)
			model.localId = entity.localId

			return model
		}
	}

	private internalConvertModelsToEntities = async (
		models: DATA_MODEL[],
	): Promise<ENTITY[]> => {
		const result = await Promise.all(
			models.map(async model => {
				const entity = await this.internalConvertModelToEntity(model)
				if (entity) {
					entity.localState = SynchronizableLocalState.SAVED_ON_API
					return entity
				}
			}),
		)

		return result.filter(model => model !== undefined) as ENTITY[]
	}

	private internalConvertEntitiesToModels = async (
		entities: ENTITY[],
	): Promise<DATA_MODEL[]> => {
		const result = await Promise.all(
			entities.map(entity => this.internalConvertEntityToModel(entity)),
		)

		return result.filter(entity => entity !== undefined) as DATA_MODEL[]
	}

	//#endregion

	//#region PUBLIC REQUESTS

	/**
	 * @description Get a entity by id
	 * @param id Entity's id on API
	 */
	getById = async (id: ID): Promise<ENTITY | undefined> => {
		return this.dbGetById(id)
	}

	/**
	 * @description Get a entity by local id
	 * @param localId Entity's local id
	 */
	getByLocalId = async (localId: number): Promise<ENTITY | undefined> => {
		return this.dbGetByLocalId(localId)
	}

	/**
	 * @description Get all entities
	 */
	getAll = async (): Promise<ENTITY[]> => {
		return this.dbGetAllNotFakeDeleted()
	}

	/**
	 * @description Return the first entity
	 */
	getFirst = async (): Promise<ENTITY | undefined> => {
		const entites = await this.table.toArray()
		return entites.length > 0 ? entites[0] : undefined
	}

	/**
	 * @description Save a entity locally and, if possible, in API
	 * @param entity Entity to save
	 */
	save = async (entity: ENTITY): Promise<ENTITY | undefined> => {
		const hasPermission = await AuthService.hasPermissions(this.getDinoPermissions())
		if (!hasPermission) return

		this.updateLastUpdate(entity)
		entity.localState = SynchronizableLocalState.SAVED_LOCALLY

		const dbEntity = await this.dbSave(entity)

		if (dbEntity.localId) {
			this.triggerUpdateEvent()

			const model = await this.internalConvertEntityToModel(entity)

			if (model) {
				const result = await this.apiSave(model)
				if (this.apiResultSuccess(result)) {
					const response = result.data!

					const newEntity = await this.internalConvertModelToEntity(
						response.data,
					)

					if (newEntity) {
						newEntity.localId = dbEntity.localId
						newEntity.localState = SynchronizableLocalState.SAVED_ON_API
						await this.dbSave(newEntity)
						this.triggerUpdateEvent()

						return newEntity
					} else {
						LogAppErrorService.logMessage(
							JSON.stringify(response.data),
							SyncConstants.CONVERT_MODEL_TO_ENTITY_ERROR,
						)
					}
				} else if (result.status === APITreatedResponseStatus.NO_PERMISSION) {
					await this.dbDelete(dbEntity)
				}
			}

			return dbEntity
		}
	}

	/**
	 * @description Save entities locally and, if possible, in API
	 * @param entities Entities to save
	 */
	saveAll = async (entities: ENTITY[]) => {
		const hasPermission = await AuthService.hasPermissions(this.getDinoPermissions())
		if (!hasPermission) return

		entities.forEach(entity => {
			this.updateLastUpdate(entity)
			entity.localState = SynchronizableLocalState.SAVED_LOCALLY
		})

		await this.dbSaveAll(entities)

		const models = await this.internalConvertEntitiesToModels(entities)

		const result = await this.apiSaveAll(models)

		if (this.apiResultSuccess(result)) {
			const response = result.data!
			const models = response.data
			const newEntities = await this.internalConvertModelsToEntities(models)
			await this.dbSaveAll(newEntities)
		} else if (result.status === APITreatedResponseStatus.NO_PERMISSION) {
			await this.dbDeleteAll(entities)
		}

		this.triggerUpdateEvent()
	}

	/**
	 * @description Save new entity from API data model
	 * @param model Data model of entity
	 */
	saveFromDataModelLocally = async (model: DATA_MODEL) => {
		const hasPermission = await AuthService.hasPermissions(this.getDinoPermissions())
		if (!hasPermission) return

		const entity = await this.internalConvertModelToEntity(model)
		if (entity) {
			await this.saveOnlyLocally(entity)
		}
	}

	/**
	 * @description Save new entities from API data model locally
	 * @param models Data models of each entity
	 */
	saveAllFromDataModelLocally = async (models: DATA_MODEL[]) => {
		const hasPermission = await AuthService.hasPermissions(this.getDinoPermissions())
		if (!hasPermission) return

		const entities = await this.internalConvertModelsToEntities(models)
		if (entities.length > 0) {
			await this.saveAllOnlyLocally(entities)
		}
	}

	/**
	 * @description Save an entity only locally (without sync)
	 * @param entity Entity to save
	 */
	saveOnlyLocally = async (entity: ENTITY) => {
		const hasPermission = await AuthService.hasPermissions(this.getDinoPermissions())
		if (!hasPermission) return

		await this.dbSave(entity)
		this.triggerUpdateEvent()
	}

	/**
	 * @description Save entities only locally (without sync)
	 * @param entities Entities to save
	 */
	saveAllOnlyLocally = async (entities: ENTITY[]) => {
		const hasPermission = await AuthService.hasPermissions(this.getDinoPermissions())
		if (!hasPermission) return

		await this.dbSaveAll(entities)
		this.triggerUpdateEvent()
	}

	/**
	 * @description Delete a entity locally and, if possible, in API
	 * @param entity Entity to delete
	 */
	delete = async (entity: ENTITY) => {
		const hasPermission = await AuthService.hasPermissions(this.getDinoPermissions())
		if (!hasPermission) return

		if (entity.id === undefined) {
			await this.dbDelete(entity)
			this.triggerUpdateEvent()
			return
		}

		this.updateLastUpdate(entity)
		const deleted = await this.dbFakeDelete(entity)

		if (deleted) {
			this.triggerUpdateEvent()
			const model = await this.internalConvertEntityToModel(entity)

			if (model) {
				const result = await this.apiDelete(model)

				if (this.apiResultSuccess(result)) {
					const response = result.data!
					if (response.success) {
						await this.dbDelete(entity)
						return true
					} else if (response.data) {
						const apiEntity = await this.internalConvertModelToEntity(
							response.data,
						)
						if (apiEntity) {
							apiEntity.localId = entity.localId
							apiEntity.localState = SynchronizableLocalState.SAVED_ON_API
							await this.dbSave(apiEntity)
							this.triggerUpdateEvent()
						} else {
							LogAppErrorService.logMessage(
								JSON.stringify(response.data),
								SyncConstants.CONVERT_MODEL_TO_ENTITY_ERROR,
							)
						}
					}
				} else if (result.status === APITreatedResponseStatus.NO_PERMISSION) {

				}
			} else {
				LogAppErrorService.logMessage(
					JSON.stringify(entity),
					SyncConstants.CONVERT_ENTITY_TO_MODEL_ERROR,
				)
			}
		}
	}

	/**
	 * @description Delete entities locally and, if possible, in API
	 * @param entities Entities to delete
	 */
	deleteAll = async (entities: ENTITY[]) => {
		const hasPermission = await AuthService.hasPermissions(this.getDinoPermissions())
		if (!hasPermission) return

		const filterById = ArrayUtils.partition(entities, entity =>
			Utils.isNotEmpty(entity.id),
		)

		await this.dbDeleteAll(filterById.notSelected)

		if (filterById.selected.length > 0) {
			const deleted = await this.dbFakeDeleteAll(filterById.selected)
			this.triggerUpdateEvent()
			if (deleted) {
				const models = await this.internalConvertEntitiesToModels(entities)
				const result = await this.apiDeleteAll(models)

				if (this.apiResultSuccess(result)) {
					await this.dbDeleteAll(entities)
					this.triggerUpdateEvent()
				}
			}
		}
	}

	/**
	 * @description Erase all data on local database
	 */
	clearDatabase = async () => {
		await this.dbClear()
	}

	//#endregion

	//#region AUTH

	/**
	 * @description Apply service rules, clears local data, when user logout
	 */
	onLogout = async (): Promise<void> => {
		return this.dbClear()
	}

	//#endregion

	//#region WEB SOCKET

	/**
	 * @description Return basic WebSocket subscribers for auto synchronizable service.
	 * To add more dependencies use onGet... function.
	 */
	protected getWebSocketSubscribers = (): WebSocketSubscriber<any>[] => {
		const defaultSubscribers = [
			{
				path: this.getUpdateWebSocketPath(),
				callback: this.webSocketUpdate,
			},
			{
				path: this.getDeleteWebSocketPath(),
				callback: this.webSockeDelete,
			},
		]

		const extraSubscribers = this.onGetWebSocketSubscribers()

		return defaultSubscribers.concat(extraSubscribers)
	}

	private getUpdateWebSocketPath = (): string => {
		const partialUpdateURL =
			this.webSocketBaseURL + SyncConstants.WEBSOCKET_UPDATE_URL

		return this.addWebSocketBaseURL(partialUpdateURL)
	}

	private getDeleteWebSocketPath = (): string => {
		const partialDeleteURL =
			this.webSocketBaseURL + SyncConstants.WEBSOCKET_DELETE_URL

		return this.addWebSocketBaseURL(partialDeleteURL)
	}

	private addWebSocketBaseURL = (url: string): string => {
		return this.webSocketURLService.generateDestinationPath(url)
	}

	private webSocketUpdate = async (
		model: SynchronizableWSUpdateModel<ID, DATA_MODEL>,
	) => {
		if (model && model.data && model.data.length > 0) {
			const entities = await this.internalConvertModelsToEntities(model.data)
			entities.forEach(entity => (entity.localId = undefined))

			const orderedEntities = entities
				.filter(entity => Utils.isNotEmpty(entity.id))
				.sort(this.sortEntityById)

			const dbEntities = await this.dbGetAllById(orderedEntities)

			const orderedDbEntities = dbEntities.sort(this.sortEntityById)

			let count = 0

			const entitiesToSave = orderedEntities.map(entity => {
				const dbEntity = orderedDbEntities[count]

				if (dbEntity && entity.id === dbEntity.id) {
					entity.localId = dbEntity.localId
					count++
				}

				return entity
			})

			await this.dbSaveAll(entitiesToSave)

			await this.onWebSocketUpdate(model)

			this.triggerUpdateEvent()
		}
	}

	private webSockeDelete = async (model: SynchronizableWSDeleteModel<ID>) => {
		if (model && model.data && model.data.length > 0) {
			await this.dbDeleteAllById(model.data)
			await this.onWebSocketDelete(model)
			this.triggerUpdateEvent()
		}
	}

	//#endregion

	//#region SYNC

	/**
	 * @description Start entity save sync with API.
	 */
	protected syncSave = async (): Promise<boolean> => {
		const hasPermission = await AuthService.hasPermissions(this.getDinoPermissions())
		if (!hasPermission) return false

		const notSavedEntities = await this.dbGetAllNotSavedOnAPI()

		const notSavedModels = await this.internalConvertEntitiesToModels(
			notSavedEntities,
		)

		const result = await this.apiSaveSync(notSavedModels)

		if (this.apiResultSuccess(result)) {
			const saveResponse = result.data!

			await this.dbDeleteAllFakeDeleteds()

			const entities = await this.internalConvertModelsToEntities(
				saveResponse.data,
			)

			await this.dbClear()

			await this.dbSaveAll(entities)

			this.triggerUpdateEvent()

			return true
		}

		return false
	}

	/**
	 * @description Start entity delete sync with API.
	 */
	protected syncDelete = async (): Promise<boolean> => {
		const hasPermission = await AuthService.hasPermissions(this.getDinoPermissions())
		if (!hasPermission) return false

		const deletedEntities = await this.dbGetAllFakeDeleted()

		if (deletedEntities.length === 0) return true

		const deletedModels = await this.internalConvertEntitiesToModels(
			deletedEntities,
		)

		const result = await this.apiDeleteAll(deletedModels)

		if (this.apiResultSuccess(result)) {
			await this.dbDeleteAllFakeDeleteds()

			this.triggerUpdateEvent()

			return true
		}

		return false
	}

	//#endregion

	//#region DATABASE

	private dbGetById = async (id: ID) => {
		return this.table.where('id').equals(id).first()
	}

	private dbGetByLocalId = async (localId: number) => {
		return this.table.where('localId').equals(localId).first()
	}

	private dbGetAllById = async (entities: ENTITY[]): Promise<ENTITY[]> => {
		const ids = entities
			.filter(entity => Utils.isNotEmpty(entity.id))
			.map(entity => entity.id!)
		return this.table.where('id').anyOf(ids).toArray()
	}

	private dbDelete = async (entity: ENTITY) => {
		if (entity.localId) {
			await this.dbDeleteByLocalId(entity.localId)
		}
	}

	private dbDeleteByLocalId = async (localId: number) => {
		await this.table.delete(localId)
	}

	private dbFakeDelete = async (entity: ENTITY): Promise<boolean> => {
		if (entity.localId) {
			const deletedItens = await this.table
				.where('localId')
				.equals(entity.localId)
				.modify(item => {
					item.localState = SynchronizableLocalState.DELETED_LOCALLY
					item.lastUpdate = entity.lastUpdate
				})
			return deletedItens === 1
		}
		return false
	}

	private dbFakeDeleteAll = async (entities: ENTITY[]): Promise<boolean> => {
		const deletedItens = await this.dbFakeDeleteAllWithId(entities)

		return deletedItens > 0
	}

	private dbFakeDeleteAllWithId = async (entities: ENTITY[]) => {
		const lastUpdate = this.getLastUpdate()

		const entitiesIds = entities
			.filter(entity => Utils.isNotEmpty(entity.localId))
			.map(entity => entity.localId!)

		return await this.table
			.where('localId')
			.anyOf(entitiesIds)
			.modify(item => {
				item.localState = SynchronizableLocalState.DELETED_LOCALLY
				item.lastUpdate = lastUpdate
			})
	}

	private dbDeleteAll = async (entities: ENTITY[]) => {
		const localIds = entities
			.filter(entity => Utils.isNotEmpty(Utils.isNotEmpty(entity.localId)))
			.map(entity => entity.localId!)

		return this.table.where('localId').anyOf(localIds).delete()
	}

	private dbDeleteAllById = async (ids: ID[]) => {
		await this.table.where('id').anyOf(ids).delete()
	}

	private dbSave = async (entity: ENTITY): Promise<ENTITY> => {
		this.removeEmptyLocalIdFromEntity(entity)

		const localId = await this.table.put(entity)

		entity.localId = localId

		return entity
	}

	private dbGetAllNotFakeDeleted = async (): Promise<ENTITY[]> => {
		return this.table
			.where('localState')
			.notEqual(SynchronizableLocalState.DELETED_LOCALLY)
			.toArray()
	}

	private dbGetAllFakeDeleted = async (): Promise<ENTITY[]> => {
		return this.table
			.where('localState')
			.equals(SynchronizableLocalState.DELETED_LOCALLY)
			.toArray()
	}

	private dbGetAllNotSavedOnAPI = async (): Promise<ENTITY[]> => {
		return this.table
			.where('localState')
			.equals(SynchronizableLocalState.SAVED_LOCALLY)
			.toArray()
	}

	private dbSaveAll = async (entities: ENTITY[]) => {
		this.removeEmptyLocalIdFromEntities(entities)
		const ids = await this.table.bulkPut(entities, { allKeys: true })
		entities.forEach((entity, index) => (entity.localId = ids[index]))
	}

	private dbDeleteAllFakeDeleteds = async () => {
		await this.table
			.where('localState')
			.equals(SynchronizableLocalState.DELETED_LOCALLY)
			.delete()
	}

	private dbClear = async () => {
		await this.table.clear()
	}

	//#endregion

	//#region API

	private getBaseRequestURL = (): string => {
		return this.apiBaseURL
	}

	private saveRequestURL = (): string => `${this.getBaseRequestURL()}save/`

	private deleteRequestURL = (): string => `${this.getBaseRequestURL()}delete/`

	private saveAllRequestURL = (): string => `${this.saveRequestURL()}all/`

	private deleteAllRequestURL = (): string => `${this.deleteRequestURL()}all/`

	private syncSaveRequestURL = (): string =>
		`${this.getBaseRequestURL()}sync_save/`

	private apiSave = async (
		data: DATA_MODEL,
	): Promise<APITreatedResponse<SynchronizableDataResponseModel<ID, DATA_MODEL>>> => {
		const request = await DinoAgentService.post(this.saveRequestURL())
		const result: APITreatedResponse<SynchronizableDataResponseModel<ID, DATA_MODEL>> = {
			data: undefined,
			status: APITreatedResponseStatus.SUCCESS
		}

		try {
			const permissions = this.getDinoPermissions()
			await request.authenticate(permissions)
			if (!request.hasPermissions) {
				result.status = APITreatedResponseStatus.NO_PERMISSION
				return result
			}
			if (request.canGo) {
				const response = await request.setBody(data).go()
				result.data = response.body
				return result
			}
		} catch (e) {
			LogAppErrorService.logError(e)
		}

		result.status = APITreatedResponseStatus.FAILURE
		return result
	}

	private apiDelete = async (
		model: DATA_MODEL,
	): Promise<APITreatedResponse<SynchronizableDataResponseModel<ID, DATA_MODEL>>> => {
		const request = await DinoAgentService.delete(this.deleteRequestURL())
		const result: APITreatedResponse<SynchronizableDataResponseModel<ID, DATA_MODEL>> = {
			data: undefined,
			status: APITreatedResponseStatus.SUCCESS
		}

		const requestModel: SynchronizableDeleteModel<ID> = {
			id: model.id,
			lastUpdate: model.lastUpdate,
		}

		try {
			const permissions = this.getDinoPermissions()
			await request.authenticate(permissions)
			if (!request.hasPermissions) {
				result.status = APITreatedResponseStatus.NO_PERMISSION
				return result
			}
			if (request.canGo) {
				const response = await request.setBody(requestModel).go()
				return response.body
			}
		} catch (e) {
			LogAppErrorService.logError(e)
		}

		result.status = APITreatedResponseStatus.FAILURE
		return result
	}

	private apiSaveAll = async (
		models: DATA_MODEL[],
	): Promise<APITreatedResponse<SynchronizableListDataResponseModel<ID, DATA_MODEL>>> => {
		const request = await DinoAgentService.post(this.saveAllRequestURL())
		const result: APITreatedResponse<SynchronizableListDataResponseModel<ID, DATA_MODEL>> = {
			data: undefined,
			status: APITreatedResponseStatus.SUCCESS
		}

		const requestModel: SynchronizableSaveAllModel<ID, DATA_MODEL> = {
			data: models,
		}

		try {
			const permissions = this.getDinoPermissions()
			await request.authenticate(permissions)
			if (!request.hasPermissions) {
				result.status = APITreatedResponseStatus.NO_PERMISSION
				return result
			}
			if (request.canGo) {
				const response = await request.setBody(requestModel).go()
				return response.body
			}
		} catch (e) {
			LogAppErrorService.logError(e)
		}

		result.status = APITreatedResponseStatus.FAILURE
		return result
	}

	private apiDeleteAll = async (
		models: DATA_MODEL[],
	): Promise<APITreatedResponse<SynchronizableGenericDataResponseModel<Array<ID>>>> => {
		const request = await DinoAgentService.delete(this.deleteAllRequestURL())
		const result: APITreatedResponse<SynchronizableGenericDataResponseModel<Array<ID>>> = {
			data: undefined,
			status: APITreatedResponseStatus.SUCCESS
		}

		const requestModel: SynchronizableDeleteAllListModel<ID> = {
			data: models.map(model => ({
				id: model.id,
				lastUpdate: model.lastUpdate,
			})),
		}

		try {
			const permissions = this.getDinoPermissions()
			await request.authenticate(permissions)
			if (!request.hasPermissions) {
				result.status = APITreatedResponseStatus.NO_PERMISSION
				return result
			}
			if (request.canGo) {
				const response = await request.setBody(requestModel).go()
				return response.body
			}
		} catch (e) {
			LogAppErrorService.logError(e)
		}

		result.status = APITreatedResponseStatus.FAILURE
		return result
	}

	private apiSaveSync = async (
		toSave: Array<DATA_MODEL>,
	): Promise<APITreatedResponse<SynchronizableSyncResponseModel<ID, DATA_MODEL>>> => {
		const result: APITreatedResponse<SynchronizableSyncResponseModel<ID, DATA_MODEL>> = {
			data: undefined,
			status: APITreatedResponseStatus.SUCCESS
		}

		try {
			const request = await DinoAgentService.put(this.syncSaveRequestURL())

			const requestModel: SynchronizableSyncModel<ID, DATA_MODEL> = {
				save: toSave,
			}
			const permissions = this.getDinoPermissions()
			await request.authenticate(permissions)
			if (request.canGo) {
				const response = await request.setBody(requestModel).go()
				result.data = response.body
				return result
			}
		} catch (e) {
			LogAppErrorService.logError(e)
		}

		result.status === APITreatedResponseStatus.FAILURE
		return result
	}

	private apiResultSuccess<T extends SynchronizableGenericResponseModel>
	(result: APITreatedResponse<T>) {
		return result.status === APITreatedResponseStatus.SUCCESS && result.data && result.data.success
	}

	//#endregion

	//#region UTILS

	private getLastUpdate = () => {
		return new Date()
	}

	private updateLastUpdate = (entity: ENTITY) => {
		entity.lastUpdate = this.getLastUpdate()
	}

	private sortEntityById = (a: ENTITY, b: ENTITY): number => {
		if (a.id! > b.id!) {
			return 1
		} else {
			return -1
		}
	}

	private removeEmptyLocalIdFromEntities(entities: Array<ENTITY>) {
		entities.forEach(entity => this.removeEmptyLocalIdFromEntity(entity))
	}

	private removeEmptyLocalIdFromEntity(entity: ENTITY) {
		if (entity.localId === undefined || entity.localId === null) {
			delete entity.localId
		}
	}

	//#endregion
}
