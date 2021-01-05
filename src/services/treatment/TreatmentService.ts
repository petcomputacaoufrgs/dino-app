import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import APIWebSocketDestConstants from '../../constants/api/APIWebSocketDestConstants'
import TreatmentDataModel from '../../types/treatment/api/TreatmentDataModel'
import TreatmentEntity from '../../types/treatment/database/TreatmentEntity'
import TreatmentRepository, {
  TreatmentRepositoryImpl,
} from '../../storage/database/treatment/TreatmentRepository'
import SynchronizableService from '../sync/SynchronizableService'
import WebSocketTopicURLService from '../websocket/WebSocketTopicURLService'

export class TreatmentServiceImpl extends AutoSynchronizableService<
  number,
  TreatmentDataModel,
  TreatmentEntity,
  TreatmentRepositoryImpl
> {
  constructor() {
    super(
      TreatmentRepository,
      APIRequestMappingConstants.TREATMENT,
      WebSocketTopicURLService,
      APIWebSocketDestConstants.TREATMENT
    )
  }

  getDependencies(): SynchronizableService[] {
    return []
  }
  
  async convertModelToEntity(
    model: TreatmentDataModel
  ): Promise<TreatmentEntity> {
    const entity: TreatmentEntity = {
      name: model.name,
    }

    return entity
  }

  async convertEntityToModel(
    entity: TreatmentEntity
  ): Promise<TreatmentDataModel> {
    const model: TreatmentDataModel = {
      name: entity.name,
    }

    return model
  }
}

export default new TreatmentServiceImpl()
