import ContactDataModel from '../../types/contact/api/ContactDataModel'
import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import ContactEntity from '../../types/contact/database/ContactEntity'
import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import APIWebSocketDestConstants from '../../constants/api/APIWebSocketDestConstants'
import PhoneEntity from '../../types/contact/database/PhoneEntity'
import GoogleContactEntity from '../../types/contact/database/GoogleContactEntity'
import StringUtils from '../../utils/StringUtils'
import ContactView from '../../types/contact/view/ContactView'
import SynchronizableService from '../sync/SynchronizableService'
import PhoneService from './PhoneService'
import GoogleContactService from './GoogleContactService'
import WebSocketQueueURLService from '../websocket/path/WebSocketQueuePathService'
import Database from '../../storage/database/Database'

export class ContactServiceImpl extends AutoSynchronizableService<
  number,
  ContactDataModel,
  ContactEntity
> {  
  constructor() {
    super(
      Database.contact, 
      APIRequestMappingConstants.CONTACT,
      WebSocketQueueURLService,
      APIWebSocketDestConstants.CONTACT
    )
  }

  getSyncDependencies(): SynchronizableService[] {
    return []
  }

  async convertModelToEntity(model: ContactDataModel): Promise<ContactEntity> {
    const entity: ContactEntity = {
      name: model.name,
      description: model.description,
      color: model.color,
    }

    return entity
  }

  async convertEntityToModel(entity: ContactEntity): Promise<ContactDataModel> {
    const model: ContactDataModel = {
      name: entity.name,
      description: entity.description,
      color: entity.color,
    }

    return model
  }

  getContactViews(
    contacts: ContactEntity[],
    phones: PhoneEntity[],
    googleContacts: GoogleContactEntity[]
  ): ContactView[] {
    return contacts.map(
      (contact) =>
        ({
          contact: contact,
          phones: PhoneService.getByContact(contact, phones),
          googleContact: GoogleContactService.getByContact(
            contact,
            googleContacts
          ),
        } as ContactView)
    ).sort((a,b) =>  a.contact.name > b.contact.name ? 1 : -1)
  }

  filterContactViews(
    contacts: ContactView[],
    searchTerm: string
  ): ContactView[] {
    return contacts.filter((item) =>
      StringUtils.contains(item.contact.name, searchTerm)
    )
  }

  async deleteAllEssentialContacts() {
    await this.deleteAll(await this.table.where('isEssential').equals('true').toArray())
  }
}

export default new ContactServiceImpl()
