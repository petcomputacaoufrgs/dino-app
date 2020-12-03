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

//TODO: Remover métodos não utilizados
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
  protected requestMapping: string
  protected repository: REPOSITORY

  constructor(repository: REPOSITORY, requestMapping: string) {
    this.requestMapping = requestMapping
    this.repository = repository
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

  //#region PUBLIC REQUESTS

  public getAll = async (): Promise<ENTITY[]> => {
    return this.localGetAllNotDeleted()
  }

  //TODO: Delete
  //TODO: Save

  public sync = async (): Promise<boolean> => {
    const needSync = await this.needSync()
    if (needSync) {
      return await this.doSync()
    }

    return true
  }

  //#endregion

  //#region SYNC METHODS

  protected needSync = async (): Promise<boolean> => {
    return this.repository.needSync()
  }

  protected doSync = async (): Promise<boolean> => {
    const entities = await this.repository.getAll()

    const successDeleting = await this.syncDeleteAll()

    if (!successDeleting) {
      return false
    }

    const successSaving = await this.syncSaveAll()

    if (!successSaving) {
      return false
    }

    const successGetting = await this.apiGetAll()

    if (successGetting) {
      //TODO: Update context

      return true
    }

    return false
  }

  protected syncDeleteAll = async (): Promise<boolean> => {
    const deletedEntities = await this.localGetAllDeleted()

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

      await this.localSaveAll(entities)
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

  //#region DATABASE PROTECTED REQUESTS

  protected localFakeDelete = async (entity: ENTITY) => {
    await this.repository.fakeDelete(entity)
  }

  protected localSave = async (entity: ENTITY): Promise<ENTITY> => {
    return await this.repository.save(entity)
  }

  protected localGetAllNotDeleted = async (): Promise<ENTITY[]> => {
    return await this.repository.getAllNotDeleted()
  }

  protected localGetAllDeleted = async (): Promise<ENTITY[]> => {
    return await this.repository.getAllDeleted()
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
}
