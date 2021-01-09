import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import APIWebSocketDestConstants from '../../constants/api/APIWebSocketDestConstants'
import SynchronizableService from '../sync/SynchronizableService'
import WebSocketQueueURLService from '../websocket/path/WebSocketQueuePathService'
import Database from '../../storage/database/Database'
import EssentialContactDataModel from '../../types/contact/api/EssentialContactDataModel'
import EssentialContactEntity from '../../types/contact/database/EssentialContactEntity'
import UserSettingsEntity from '../../types/user/database/UserSettingsEntity'
import ContactEntity from '../../types/contact/database/ContactEntity'
import ContactService from './ContactService'
import TreatmentService from '../treatment/TreatmentService'
import { Console } from 'console'

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


  
  public async saveUserEssentialContacts(settings: UserSettingsEntity) {

    const entities = await this.table.filter(ec => {
      const treatmentIds = ec.treatmentIds

      const isUniversal = () => treatmentIds === undefined || treatmentIds.length === 0

      const isFromUserTreatment = () => { 

        if(settings.includeEssentialContact && treatmentIds !== undefined && settings.treatmentId !== undefined) {
            return treatmentIds.includes(settings.treatmentId)

        } return false
      }

      return isUniversal() || isFromUserTreatment()
      
    }).toArray()

    ContactService.saveAll(entities.map(ec => this.convertEntityToContactEntity(ec)))
    
  }

  private convertEntityToContactEntity(entity: EssentialContactEntity) {
    const contactEntity: ContactEntity = {
      name: entity.name,
      description: entity.description,
      color: entity.color,
      isEssential: true
    }

    return contactEntity
  }
  
}

export default new EssentialContactServiceImpl()
