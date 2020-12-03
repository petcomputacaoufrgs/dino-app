import { IndexableType } from 'dexie'
import SynchronizableDataModel from '../../types/synchronizable/api/SynchronizableDataModel'
import DinoAgentService from '../../agent/DinoAgentService'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import SynchronizableGetModel from '../../types/synchronizable/api/request/SynchronizableGetModel'
import LogAppErrorService from '../log_app_error/LogAppErrorService'
import SynchronizableDataResponseModel from '../../types/synchronizable/api/response/SynchronizableResponseModel'
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

/**
 * Generic service with basic methods for synchronizable entity
 * @param ID API synchronizable entity's id
 * @param LOCAL_ID local synchronizable entity's id
 * @param DATA_MODEL synchronizable entity's data model
 * @param ENTITY local synchronizable entity
 * @param REPOSITORY local synchronizable entity's repository
 */
export default abstract class SynchronizableService<
  ID extends IndexableType,
  LOCAL_ID extends IndexableType,
  DATA_MODEL extends SynchronizableDataModel<ID>,
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

  //#region CONVERSION (MODEL <-> ENTITY)

  abstract convertModelToEntity(model: DATA_MODEL): ENTITY

  abstract convertEntityToModel(model: ENTITY): DATA_MODEL

  protected convertModelsToEntities = (models: DATA_MODEL[]): ENTITY[] =>
    models.map((model) => this.convertModelToEntity(model))

  protected convertEntitiesToModels = (entities: ENTITY[]): DATA_MODEL[] =>
    entities.map((entity) => this.convertEntityToModel(entity))

  //#endregion

  //#region API URL

  private getBaseRequestURL = (): string =>
    `${DinoAPIURLConstants.URL}${this.requestMapping}/`

  private getRequestURL: string = `${this.getBaseRequestURL}get/`

  private saveRequestURL: string = `${this.getBaseRequestURL}save/`

  private deleteRequestURL: string = `${this.getBaseRequestURL}delete/`

  private getAllRequestURL: string = `${this.getRequestURL}all/`

  private saveAllRequestURL: string = `${this.saveRequestURL}all/`

  private deleteAllRequestURL: string = `${this.deleteRequestURL}all/`

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
      const entities = this.convertModelsToEntities(model.data)
        .filter((entity) => entity.id !== undefined)
        .sort(this.sortEntityById)

      const dbEntities = await this.localGetAllById(entities)

      const orderedDbEntities = dbEntities.sort(this.sortEntityById)

      let count = 0

      const entitiesToSave = entities.map((entity) => {
        const dbEntity = orderedDbEntities[count]

        entity.localState = SynchronizableLocalState.SAVED_ON_API

        if (entity.id === dbEntity.id) {
          entity.localId = dbEntity.localId
          count++
        }

        return entity
      })

      await this.localSaveAll(entitiesToSave)
      this.updateContext()
    }
  }

  public webSockeDelete = (model: SynchronizableWSDeleteModel<ID>) => {
    if (model && model.data && model.data.length > 0) {
      this.localDeleteAllById(model.data)
      this.updateContext()
    }
  }

  //#endregion

  //#region PUBLIC REQUESTS

  public getAll = async (): Promise<ENTITY[]> => {
    return this.localGetAllNotFakeDeleted()
  }

  public delete = async (entity: ENTITY) => {
    const deleted = await this.localFakeDelete(entity)

    if (deleted) {
      this.updateContext()

      if (entity.id) {
        const model = this.convertEntityToModel(entity)
        const response = await this.apiDelete(model)

        if (response) {
          if (response.success) {
            await this.localDelete(entity)
          } else if (response.data) {
            const apiEntity = this.convertModelToEntity(response.data)
            apiEntity.localId = entity.localId
            apiEntity.localState = SynchronizableLocalState.SAVED_ON_API
            await this.localSave(apiEntity)
            this.updateContext()
          }
        }
      }
    }
  }

  public save = async (entity: ENTITY) => {
    entity.localState = SynchronizableLocalState.SAVED_LOCAL

    const dbEntity = await this.localSave(entity)

    if (dbEntity.localId) {
      this.updateContext()

      const model = this.convertEntityToModel(entity)
      const response = await this.apiSave(model)

      if (response && response.success) {
        const apiEntity = this.convertModelToEntity(response.data)
        apiEntity.localId = dbEntity.localId
        apiEntity.localState = SynchronizableLocalState.SAVED_ON_API
        await this.localSave(apiEntity)
        this.updateContext()
      }
    }
  }

  public sync = async (): Promise<boolean> => {
    const needSync = await this.needSync()
    if (needSync) {
      return await this.doSync()
    }

    return true
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

  protected needSync = async (): Promise<boolean> => {
    return this.repository.needSync()
  }

  protected doSync = async (): Promise<boolean> => {
    const successDeleting = await this.syncDeleteAll()

    if (!successDeleting) {
      return false
    }

    const successSaving = await this.syncSaveAll()

    if (!successSaving) {
      return false
    }

    return await this.syncGetAll()
  }

  protected syncDeleteAll = async (): Promise<boolean> => {
    const deletedEntities = await this.localGetAllFakeDeleted()

    const deletedModels = this.convertEntitiesToModels(deletedEntities)

    const deleteAllResponse = await this.apiDeleteAll(deletedModels)

    const success = this.syncProcessGenericResponse(deleteAllResponse)

    if (success) {
      await this.localDeleteAllFakeDeleteds()
    }

    return success
  }

  protected syncSaveAll = async (): Promise<boolean> => {
    const notSavedEntities = await this.localGetAllNotSavedOnAPI()

    const notSavedModels = this.convertEntitiesToModels(notSavedEntities)

    const saveAllResponse = await this.apiSaveAll(notSavedModels)

    return this.syncProcessGenericResponse(saveAllResponse)
  }

  protected syncGetAll = async (): Promise<boolean> => {
    const getAllResponse = await this.apiGetAll()
    const success = this.syncProcessGenericResponse(getAllResponse)

    if (success && getAllResponse) {
      const models = getAllResponse.data

      const entities = this.convertModelsToEntities(models)

      await this.localClear()

      const dbEntities = await this.localSaveAll(entities)

      this.setContext(dbEntities)
    }

    return success
  }

  protected syncProcessGenericResponse = (
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
    return await this.repository.getAllById(entities)
  }

  protected localDelete = async (entity: ENTITY) => {
    await this.repository.delete(entity)
  }

  protected localFakeDelete = async (entity: ENTITY): Promise<boolean> => {
    const deletedItens = await this.repository.fakeDelete(entity)

    return deletedItens === 1
  }

  protected localDeleteAllById = async (ids: ID[]) => {
    await this.repository.deleteAllById(ids)
  }

  protected localSave = async (entity: ENTITY): Promise<ENTITY> => {
    return await this.repository.save(entity)
  }

  protected localGetAllNotFakeDeleted = async (): Promise<ENTITY[]> => {
    return await this.repository.getAllNotFakeDeleted()
  }

  protected localGetAllFakeDeleted = async (): Promise<ENTITY[]> => {
    return await this.repository.getAllFakeDeleted()
  }

  protected localGetAllNotSavedOnAPI = async (): Promise<ENTITY[]> => {
    return await this.repository.getAllNotSavedOnAPI()
  }

  protected localSaveAll = async (entities: ENTITY[]): Promise<ENTITY[]> => {
    return await this.repository.saveAll(entities)
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
    const request = await DinoAgentService.get(this.getRequestURL)

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
    const request = await DinoAgentService.post(this.saveRequestURL)

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
    const request = await DinoAgentService.delete(this.deleteRequestURL)

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
    const request = await DinoAgentService.get(this.getAllRequestURL)

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
  ): Promise<SynchronizableGenericResponseModel | undefined> => {
    const request = await DinoAgentService.post(this.saveAllRequestURL)

    if (request.canGo) {
      const requestModel: SynchronizableSaveAllModel<ID, DATA_MODEL> = {
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
  ): Promise<SynchronizableGenericResponseModel | undefined> => {
    const request = await DinoAgentService.delete(this.deleteAllRequestURL)

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

  //#endregion

  //#region UTILS

  public sortEntityById = (a: ENTITY, b: ENTITY): number => {
    if (a.id! > b.id!) {
      return 1
    } else {
      return -1
    }
  }

  //#endregion
}
