import APIRequestMappingConstants from "../../constants/api/APIRequestMappingConstants"
import APIWebSocketDestConstants from "../../constants/api/APIWebSocketDestConstants"
import PhoneRepository, { PhoneRepositoryImpl } from "../../storage/database/contact/PhoneRepository"
import PhoneModel from "../../types/contact/api/PhoneModel"
import PhoneEntity from "../../types/contact/database/PhoneEntity"
import SynchronizableService from "../synchronizable/SynchronizableService"

export class PhoneServiceImpl extends SynchronizableService<
number,
number,
PhoneModel,
PhoneEntity,
PhoneRepositoryImpl
> {
  async convertModelToEntity(model: PhoneModel): Promise<PhoneEntity> {
    const entity: PhoneEntity = {
      number: model.number,
      type: model.type,
      contactId: model.contactId
    }

    return entity  
  }

  async convertEntityToModel(entity: PhoneEntity): Promise<PhoneModel> {
    const model: PhoneModel = {
    number: entity.number,
    type: entity.type,
    contactId: entity.contactId
    }
  
    return model
  }

}

export default new PhoneServiceImpl(
  PhoneRepository,
  APIRequestMappingConstants.PHONE,
  APIWebSocketDestConstants.PHONE_UPDATE,
  APIWebSocketDestConstants.PHONE_DELETE
)