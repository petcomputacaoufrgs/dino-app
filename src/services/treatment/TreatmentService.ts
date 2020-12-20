import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import SynchronizableService from '../synchronizable/SynchronizableService'
import APIWebSocketDestConstants from '../../constants/api/APIWebSocketDestConstants'
import TreatmentDataModel from '../../types/treatment/api/TreatmentDataModel'
import TreatmentEntity from '../../types/treatment/database/TreatmentEntity'
import TreatmentRepository, { TreatmentRepositoryImpl } from '../../storage/database/treatment/TreatmentRepository'

 export class TreatmentServiceImpl extends SynchronizableService<
  number,
  number,
  TreatmentDataModel,
  TreatmentEntity,
  TreatmentRepositoryImpl
> {
  async convertModelToEntity(model: TreatmentDataModel): Promise<TreatmentEntity> {
    const entity: TreatmentEntity = {
      name: model.name
    }

    return entity
  }

  async convertEntityToModel(entity: TreatmentEntity): Promise<TreatmentDataModel> {
    const model: TreatmentDataModel = {
      name: entity.name
    }

    return model
  }
}

export default new TreatmentServiceImpl(
  TreatmentRepository,
  APIRequestMappingConstants.TREATMENT,
  APIWebSocketDestConstants.TREATMENT_UPDATE,
  APIWebSocketDestConstants.TREATMENT_DELETE
)
