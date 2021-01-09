import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import APIWebSocketDestConstants from '../../constants/api/APIWebSocketDestConstants'
import SynchronizableService from '../sync/SynchronizableService'
import WebSocketQueueURLService from '../websocket/path/WebSocketQueuePathService'
import Database from '../../storage/database/Database'
import EssentialContactDataModel from '../../types/contact/api/EssentialContactDataModel'
import EssentialContactEntity from '../../types/contact/database/EssentialContactEntity'

export class EssentialContactServiceImpl extends AutoSynchronizableService<
  number,
  EssentialContactDataModel,
  EssentialContactEntity
> {  
  constructor() {
    super(
      Database.essentialContact, 
      APIRequestMappingConstants.ESSENTIAL_CONTACT,
      WebSocketQueueURLService,
      APIWebSocketDestConstants.ESSENTIAL_CONTACT
    )
  }

  getSyncDependencies(): SynchronizableService[] {
    return []
  }

  async convertModelToEntity(model: EssentialContactDataModel): Promise<EssentialContactEntity> {
    const entity: EssentialContactEntity = {
      name: model.name,
      description: model.description,
      color: model.color,
      treatmentIds: model.treatmentIds
    }

    return entity
  }

  async convertEntityToModel(entity: EssentialContactEntity): Promise<EssentialContactDataModel> {
    const model: EssentialContactDataModel = {
      name: entity.name,
      description: entity.description,
      color: entity.color,
      treatmentIds: entity.treatmentIds
    }

    return model
  }  
}

export default new EssentialContactServiceImpl()
