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
import PhoneService from './PhoneService'
import PhoneEntity from '../../types/contact/database/PhoneEntity'

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

        if(settings.includeEssentialContact) {
            return treatmentIds!.includes(settings.treatmentId!)

        } return false
      }

      return isUniversal() || isFromUserTreatment()
      
    }).toArray()

    entities.forEach(async ec => { 
      const savedContact = await ContactService.save(this.convertEntityToContactEntity(ec))
      if(savedContact) {
        savePhonesFromEssentialContact(ec, savedContact)
      }
    })

    const savePhonesFromEssentialContact = async (ec: EssentialContactEntity, c: ContactEntity) => {
      const phones = await PhoneService.getAllByEssentialContactLocalId(ec.localId!)
      const newContactPhones: PhoneEntity[] = phones.map(p => {
        return {
          localContactId: c.localId,
          number: p.number,
          type: p.type,
        }
      })
      await PhoneService.saveAll(newContactPhones)
    }
    
  }

  private convertEntityToContactEntity(entity: EssentialContactEntity) {
    const contactEntity: ContactEntity = {
      name: entity.name,
      description: entity.description,
      color: entity.color,
      isEssential: 1
    }

    return contactEntity
  }
  
}

export default new EssentialContactServiceImpl()
