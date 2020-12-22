import { IndexableType, IndexableTypePart } from 'dexie'
import DinoAgentService from '../../agent/DinoAgentService'
import SynchronizableGetModel from '../../types/synchronizable/api/request/SynchronizableGetModel'
import LogAppErrorService from '../log_app_error/LogAppErrorService'
import SynchronizableDataResponseModel from '../../types/synchronizable/api/response/SynchronizableDataResponseModel'
import SynchronizableDeleteModel from '../../types/synchronizable/api/request/SynchronizableDeleteModel'
import SynchronizableListDataResponseModel from '../../types/synchronizable/api/response/SynchronizableListDataResponseModel'
import SynchronizableSaveAllModel from '../../types/synchronizable/api/request/SynchronizableSaveAllModel'
import SynchronizableDeleteAllListModel from '../../types/synchronizable/api/request/SynchronizableDeleteAllListModel'
import SynchronizableEntity from '../../types/synchronizable/database/SynchronizableEntity'
import SynchronizableRepository from '../../storage/database/synchronizable/SynchronizableRepository'
import SynchronizableGenericResponseModel from '../../types/synchronizable/api/response/SynchronizableGenericResponseModel'
import SynchronizableLocalState from '../../types/synchronizable/database/SynchronizableLocalState'
import SynchronizableWSUpdateModel from '../../types/synchronizable/api/web_socket/SynchronizableWSUpdateModel'
import SynchronizableWSDeleteModel from '../../types/synchronizable/api/web_socket/SynchronizableWSDeleteModel'
import SynchronizableConstants from '../../constants/synchronizable/SynchronizableConstants'
import SynchronizableGenericDataResponseModel from '../../types/synchronizable/api/response/SynchronizableGenericDataResponseModel'
import ArrayUtils from '../../utils/ArrayUtils'
import SynchronizableDataLocalIdModel from '../../types/synchronizable/api/SynchronizableDataLocalIdModel'
import SynchronizableSyncModel from '../../types/synchronizable/api/request/SynchronizableSyncModel'
import SynchronizableSyncResponseModel from '../../types/synchronizable/api/response/SynchronizableSyncResponseModel'
import DateUtils from '../../utils/DateUtils'

/**
 * @description Generic service with basic methods for synchronizable entity,
 * remember to transform booleans into numbers (0,1)
 * @param ID API synchronizable entity's id
 * @param LOCAL_ID local synchronizable entity's id
 * @param DATA_MODEL synchronizable entity's data model
 * @param ENTITY local synchronizable entity
 * @param REPOSITORY local synchronizable entity's repository
 */
export default abstract class SynchronizableService<
  ID extends IndexableType,
  LOCAL_ID extends IndexableTypePart,
  DATA_MODEL extends SynchronizableDataLocalIdModel<ID, LOCAL_ID>,
  ENTITY extends SynchronizableEntity<ID, LOCAL_ID>,
  REPOSITORY extends SynchronizableRepository<ID, LOCAL_ID, ENTITY>
> {
  protected webSocketUpdatePath: string
  protected webSocketDeletePath: string
  protected requestMapping: string
  protected repository: REPOSITORY

  constructor(
    repository: REPOSITORY,
    requestMapping: string,
    webSocketUpdatePath: string,
    webSocketDeletePath: string
  ) {
    this.repository = repository
    this.requestMapping = requestMapping
    this.webSocketUpdatePath = webSocketUpdatePath
    this.webSocketDeletePath = webSocketDeletePath
  }

  //#region EVENT METHODS TO OVERRIDE
  
  /**
   * Override this function to do something before save entity on local database 
   * @param entity entity that will be saved
   */
  protected async onSaveEntity(entity: ENTITY) {  }

  /**
   * Override this function to do something after a success on sync 
   */
  protected async onSyncSuccess() { }

  /**
   * Override this function to do something when a websocket update is received
   * @param model 
   */
  protected async onWebSocketUpdate(model: SynchronizableWSUpdateModel<ID, DATA_MODEL>) { }

    /**
   * Override this function to do something when a websocket delete is received
   * @param model 
   */
  protected async onWebSocketDelete(model: SynchronizableWSDeleteModel<ID>) { }

  //#endregion

  //#region CONVERSION (MODEL <-> ENTITY)

  /**
   * @description Remember to transform model booleans into number (0,1) to save on database
   * @param model api data_model
   */
  abstract convertModelToEntity(model: DATA_MODEL): Promise<ENTITY | undefined>

  /**
   * @param entity local entity
   */
  abstract convertEntityToModel(entity: ENTITY): Promise<DATA_MODEL | undefined>

  protected async onSaveEntities(entities: Array<ENTITY>) {
    entities.forEach(entity => this.onSaveEntity(entity))
  }

  protected async internalConvertModelToEntity(model: DATA_MODEL): Promise<ENTITY | undefined> {
    const entity = await this.convertModelToEntity(model)

    if (entity) {
      entity.id = model.id
      entity.lastUpdate = DateUtils.convertDinoAPIStringDateToDate(model.lastUpdate!)

      if (model.localId !== undefined) {
        entity.localId = model.localId
      }
  
      return entity
    }
  }

  protected async internalConvertEntityToModel(entity: ENTITY): Promise<DATA_MODEL | undefined> {
    const model = await this.convertEntityToModel(entity)

    if (model) {
      model.id = entity.id
      model.lastUpdate = DateUtils.convertDateToDinoAPIStringDate(entity.lastUpdate!)
      model.localId = entity.localId
  
      return model
    }
  }

  protected internalConvertModelsToEntities = async (
    models: DATA_MODEL[]
  ): Promise<ENTITY[]> => {
    const result = await Promise.all(models.map(async (model) => {
      const entity = await this.internalConvertModelToEntity(model)
      if (entity) {
        entity.localState = SynchronizableLocalState.SAVED_ON_API
        return entity
      }
    }))

    return result.filter(model => model !== undefined) as ENTITY[]
  }

  protected internalConvertEntitiesToModels = async (
    entities: ENTITY[]
  ): Promise<DATA_MODEL[]> => {
    const result = await Promise.all(entities.map((entity) => this.internalConvertEntityToModel(entity)))

    return result.filter(entity => entity !== undefined) as DATA_MODEL[]
  }

  //#endregion

  //#region API URL

  protected getBaseRequestURL = (): string => {
    return this.requestMapping
  }

  protected getRequestURL = (): string => `${this.getBaseRequestURL()}get/`

  protected saveRequestURL = (): string => `${this.getBaseRequestURL()}save/`

  protected deleteRequestURL = (): string =>
    `${this.getBaseRequestURL()}delete/`

  protected getAllRequestURL = (): string => `${this.getRequestURL()}all/`

  protected saveAllRequestURL = (): string => `${this.saveRequestURL()}all/`

  protected deleteAllRequestURL = (): string => `${this.deleteRequestURL()}all/`

  protected syncRequestURL = (): string => `${this.getBaseRequestURL()}sync/`

  //#endregion

  //#region WEB SOCKET

  public getUpdateWebSocketPath = (): string => {
    return this.webSocketUpdatePath
  }

  public getDeleteWebSocketPath = (): string => {
    return this.webSocketDeletePath
  }

  public webSocketUpdate = async (
    model: SynchronizableWSUpdateModel<ID, DATA_MODEL>
  ) => {
    if (model && model.data && model.data.length > 0) {
      const entities = (await this.internalConvertModelsToEntities(model.data))
        .filter((entity) => entity.id !== undefined && entity.id !== null)
        .sort(this.sortEntityById)

      const dbEntities = await this.localGetAllById(entities)

      const orderedDbEntities = dbEntities.sort(this.sortEntityById)

      let count = 0

      const entitiesToSave = entities.map((entity) => {
        const dbEntity = orderedDbEntities[count]

        if (dbEntity && entity.id === dbEntity.id) {
          entity.localId = dbEntity.localId
          count++
        }

        this.onSaveEntity(entity)

        return entity
      })

      await this.localSaveAll(entitiesToSave)

      await this.onWebSocketUpdate(model)

      this.updateContext()
    }
  }

  public webSockeDelete = async (model: SynchronizableWSDeleteModel<ID>) => {
    if (model && model.data && model.data.length > 0) {
      await this.localDeleteAllById(model.data)
      await this.onWebSocketDelete(model)
      this.updateContext()
    }
  }

  //#endregion

  //#region PUBLIC REQUESTS

  public getById = async (id: number): Promise<ENTITY | undefined> => {
    return this.repository.getById(id)
  }

  public getByLocalId = async (localId: number): Promise<ENTITY | undefined> => {
    return this.repository.getByLocalId(localId)
  }

  public getAll = async (): Promise<ENTITY[]> => {
    return this.localGetAllNotFakeDeleted()
  }

  public delete = async (entity: ENTITY) => {
    this.updateLastUpdate(entity)
    const deleted = await this.localFakeDelete(entity)

    if (deleted) {
      this.updateContext()

      if (entity.id) {
        const model = await this.internalConvertEntityToModel(entity)

        if (model) {
          const response = await this.apiDelete(model)

          if (response) {
            if (response.success) {
              await this.localDelete(entity)
            } else if (response.data) {
              const apiEntity = await this.internalConvertModelToEntity(response.data)
              if (apiEntity) {
                apiEntity.localId = entity.localId
                apiEntity.localState = SynchronizableLocalState.SAVED_ON_API
                await this.localSave(apiEntity)
                this.updateContext()
              } else {
                LogAppErrorService.logMessage(JSON.stringify(response.data), SynchronizableConstants.CONVERT_MODEL_TO_ENTITY_ERROR)
              }
            }
          }
        } else {
          LogAppErrorService.logMessage(JSON.stringify(entity), SynchronizableConstants.CONVERT_ENTITY_TO_MODEL_ERROR)
        }
      }
    }
  }

  public save = async (entity: ENTITY): Promise<ENTITY | undefined> => {
    this.updateLastUpdate(entity)
    entity.localState = SynchronizableLocalState.SAVED_LOCALLY

    const dbEntity = await this.localSave(entity)

    if (dbEntity.localId) {
      this.updateContext()

      const model = await this.internalConvertEntityToModel(entity)

      if (model) {
        const response = await this.apiSave(model)
        if (response && response.success) {
          const newEntity = await this.internalConvertModelToEntity(response.data)

          if (newEntity) {
            newEntity.localId = dbEntity.localId
            newEntity.localState = SynchronizableLocalState.SAVED_ON_API
            await this.localSave(newEntity)
            this.updateContext()

            return newEntity
          } else {
            LogAppErrorService.logMessage(JSON.stringify(response.data), SynchronizableConstants.CONVERT_MODEL_TO_ENTITY_ERROR)
          }
        }
      } else {
        LogAppErrorService.logMessage(JSON.stringify(entity), SynchronizableConstants.CONVERT_ENTITY_TO_MODEL_ERROR)
      }

      return dbEntity
    }
  }

  public saveAll = async (entities: ENTITY[]) => {    
    entities.forEach(entity => {
      this.updateLastUpdate(entity)
      entity.localState = SynchronizableLocalState.SAVED_LOCALLY
    })

    await this.localSaveAll(entities)

    const models = await this.internalConvertEntitiesToModels(entities)

    const response = await this.apiSaveAll(models)

    const success = this.processGenericResponse(response)

    if (success && response) {
      const models = response.data
      const newEntities = await this.internalConvertModelsToEntities(models)
      this.onSaveEntities(newEntities)
      await this.localSaveAll(newEntities)
    } else {
      await this.localSaveAll(entities)
    }

    this.updateContext()
  }

  public deleteAll = async (entities: ENTITY[]) => {
    const deleted = await this.localFakeDeleteAll(entities)

    if (deleted) {
      const models = await this.internalConvertEntitiesToModels(
        entities
      )
      const deleteAllResponse = await this.apiDeleteAll(models)
      const success = this.processGenericResponse(deleteAllResponse)

      if (success) {
        await this.localDeleteAll(entities)
        this.updateContext()
      }

      return success
    }

    return false
  }

  public sync = async (): Promise<boolean> => {
    const success = await this.doSync()

    if (success) {
      this.onSyncSuccess()
    }

    return success
  }

  public removeData = async () => {
    await this.localClear()
  }

  //#endregion

  //#region CONTEXT PROVIDER

  protected contextProviderCallback?: (data: ENTITY[]) => void

  /**
   * @description Set context provider function to update data
   */
  public setContextProviderCallback = (callback: (data: ENTITY[]) => void) => {
    this.contextProviderCallback = callback
  }

  /**
   * @description Update context provider with new data
   */
  protected setContext = (data: ENTITY[]) => {
    if (this.contextProviderCallback) {
      this.contextProviderCallback(data)
    }
  }

  /**
   * @description Get local data and update context provider
   */
  protected updateContext = async () => {
    const data = await this.getAll()
    this.setContext(data)
  }

  //#endregion

  //#region SYNC METHODS

  protected doSync = async (): Promise<boolean> => {
    const deletedEntities = await this.localGetAllFakeDeleted()

    const deletedModels = await this.internalConvertEntitiesToModels(deletedEntities)

    const notSavedEntities = await this.localGetAllNotSavedOnAPI()

    const notSavedModels = await this.internalConvertEntitiesToModels(notSavedEntities)

    const syncResponse = await this.apiSync(notSavedModels, deletedModels)

    const success = this.processGenericResponse(syncResponse)

    if (success && syncResponse) {
      await this.localDeleteAllFakeDeleteds()

      await this.localClearAndSaveAllFromModels(syncResponse.data)
    }

    return success
  }

  protected processGenericResponse = (
    response: SynchronizableGenericResponseModel | undefined
  ): boolean => {
    if (response) {
      if (response.success) {
        return true
      }
      LogAppErrorService.logSyncAPIError(response.error)
    }

    return false
  }

  //#endregion

  //#region DATABASE REQUESTS

  protected localGetAllById = async (entities: ENTITY[]): Promise<ENTITY[]> => {
    return this.repository.getAllById(entities)
  }

  protected localDelete = async (entity: ENTITY) => {
    await this.repository.delete(entity)
  }

  protected localFakeDelete = async (entity: ENTITY): Promise<boolean> => {
    const deletedItens = await this.repository.fakeDelete(entity)

    return deletedItens === 1
  }

  protected localFakeDeleteAll = async (entities: ENTITY[]): Promise<boolean> => {
    const partition = ArrayUtils.partition(entities, entity => entity.id !== undefined)

    const realDeletedItens = await this.repository.deleteAll(partition.selected)
    const deletedItens = await this.repository.fakeDeleteAll(partition.notSelected, this.getLastUpdate())

    return realDeletedItens + deletedItens > 0
  }

  protected localDeleteAll = async (entities: ENTITY[]) => {
    const localIds = entities.filter(entity => entity.localId !== undefined).map(entity => entity.localId!)
    await this.repository.deleteAllByLocalIds(localIds)
  }

  protected localDeleteAllById = async (ids: ID[]) => {
    await this.repository.deleteAllById(ids)
  }

  protected localSave = async (entity: ENTITY): Promise<ENTITY> => {
    return this.repository.save(entity)
  }

  protected localGetAllNotFakeDeleted = async (): Promise<ENTITY[]> => {
    return this.repository.getAllNotFakeDeleted()
  }

  protected localGetAllFakeDeleted = async (): Promise<ENTITY[]> => {
    return this.repository.getAllFakeDeleted()
  }

  protected localGetAllNotSavedOnAPI = async (): Promise<ENTITY[]> => {
    return this.repository.getAllNotSavedOnAPI()
  }

  protected localSaveAll = async (entities: ENTITY[]) => {
    return this.repository.saveAll(entities)
  }

  protected async localClearAndSaveAllFromModels(models: DATA_MODEL[]) {
    const entities = await this.internalConvertModelsToEntities(models)

    this.onSaveEntities(entities)

    await this.localClear()

    await this.localSaveAll(entities)

    this.updateContext()
  }

  protected localDeleteAllFakeDeleteds = async () => {
    await this.repository.deleteAllFakeDeleteds()
  }

  protected localClear = async () => {
    await this.repository.clear()
  }

  //#endregion

  //#region API REQUESTS

  protected apiGet = async (
    id: ID
  ): Promise<SynchronizableDataResponseModel<ID, DATA_MODEL> | undefined> => {
    const request = await DinoAgentService.get(this.getRequestURL())

    if (request.canGo) {
      const requestModel: SynchronizableGetModel<ID> = {
        id: id,
      }

      try {
        const response = await request.setBody(requestModel).authenticate().go()
        return response.body
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }

    return undefined
  }

  protected apiSave = async (
    data: DATA_MODEL
  ): Promise<SynchronizableDataResponseModel<ID, DATA_MODEL> | undefined> => {
    const request = await DinoAgentService.post(this.saveRequestURL())

    if (request.canGo) {
      try {
        const response = await request.setBody(data).authenticate().go()
        return response.body
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }

    return undefined
  }

  protected apiDelete = async (
    model: DATA_MODEL
  ): Promise<SynchronizableDataResponseModel<ID, DATA_MODEL> | undefined> => {
    const request = await DinoAgentService.delete(this.deleteRequestURL())

    if (request.canGo) {
      const requestModel: SynchronizableDeleteModel<ID> = {
        id: model.id,
        lastUpdate: model.lastUpdate,
      }

      try {
        const response = await request.setBody(requestModel).authenticate().go()
        return response.body
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }

    return undefined
  }

  protected apiGetAll = async (): Promise<
    SynchronizableListDataResponseModel<ID, DATA_MODEL> | undefined
  > => {
    const request = await DinoAgentService.get(this.getAllRequestURL())
    if (request.canGo) {
      try {
        const response = await request.authenticate().go()
        return response.body
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }

    return undefined
  }

  protected apiSaveAll = async (
    models: DATA_MODEL[]
  ): Promise<SynchronizableListDataResponseModel<ID, DATA_MODEL> | undefined> => {
    const request = await DinoAgentService.post(this.saveAllRequestURL())

    if (request.canGo) {
      const requestModel: SynchronizableSaveAllModel<ID, LOCAL_ID, DATA_MODEL> = {
        data: models,
      }

      try {
        const response = await request.setBody(requestModel).authenticate().go()
        return response.body
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }

    return undefined
  }

  protected apiDeleteAll = async (
    models: DATA_MODEL[]
  ): Promise<SynchronizableGenericDataResponseModel<Array<ID>> | undefined> => {
    const request = await DinoAgentService.delete(this.deleteAllRequestURL())

    if (request.canGo) {
      const requestModel: SynchronizableDeleteAllListModel<ID> = {
        data: models.map((model) => ({
          id: model.id,
          lastUpdate: model.lastUpdate,
        })),
      }

      try {
        const response = await request.setBody(requestModel).authenticate().go()
        return response.body
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }

    return undefined
  }

  protected apiSync = async (
    toSave: Array<DATA_MODEL>, 
    toDelete: Array<DATA_MODEL>
  ): Promise<SynchronizableSyncResponseModel<ID, LOCAL_ID, DATA_MODEL> | undefined> => {
    const request = await DinoAgentService.put(this.syncRequestURL())

    if (request.canGo) {
      const requestModel: SynchronizableSyncModel<ID, LOCAL_ID, DATA_MODEL> = {
        save: toSave,
        delete: toDelete.map(model => ({
          id: model.id,
          lastUpdate: model.lastUpdate
        }))
      }

      try {
        const response = await request.setBody(requestModel).authenticate().go()
        return response.body
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }

    return undefined
  }

  //#endregion

  //#region UTILS

  protected getLastUpdate = () => {
    return new Date()
  }

  protected updateLastUpdate = (entity: ENTITY) => {
    entity.lastUpdate = this.getLastUpdate()
  }

  protected sortEntityById = (a: ENTITY, b: ENTITY): number => {
    if (a.id! > b.id!) {
      return 1
    } else {
      return -1
    }
  }

  //#endregion
}
