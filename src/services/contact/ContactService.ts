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
import EssentialContactService from './EssentialContactService'
import Utils from '../../utils/Utils'

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
    return [EssentialContactService]
  }

  async convertModelToEntity(model: ContactDataModel): Promise<ContactEntity> {
    const entity: ContactEntity = {
      name: model.name,
      description: model.description,
      color: model.color
    }

    
    if (Utils.isNotEmpty(model.essentialContactId)) {
      const essentialContact = await EssentialContactService.getById(model.essentialContactId!)

      if (essentialContact) {
        entity.localEssentialContactId = essentialContact.localId
      }
    }

    return entity
  }

  async convertEntityToModel(entity: ContactEntity): Promise<ContactDataModel> {
    const model: ContactDataModel = {
      name: entity.name,
      description: entity.description,
      color: entity.color
    }

    if (Utils.isNotEmpty(entity.localEssentialContactId)) {
      const essentialContact = await EssentialContactService.getByLocalId(entity.localEssentialContactId!)

      if (essentialContact) {
        model.essentialContactId = essentialContact.id
      }
    }

    return model
  }

  async getAllDerivatedFromEssential(): Promise<ContactEntity[]> {
    return this.table.where('localEssentialContactId').aboveOrEqual(0).toArray()
  }

  async deleteUserEssentialContacts() {
    const contacts = await this.getAllDerivatedFromEssential()

    const googleContactDeletePromises = contacts.map(contact => {
      return GoogleContactService.deleteByContact(contact)
    })
    
    await Promise.all(googleContactDeletePromises)

    const phoneDeletePromises = contacts.map(contact => {
      return PhoneService.deleteByContact(contact)
    })

    await Promise.all(phoneDeletePromises)
  
    await this.deleteAll(contacts)
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
          phones: PhoneService.filterByContact(contact, phones),
          googleContact: GoogleContactService.getByContact(
            contact,
            googleContacts
          ),
        } as ContactView)
    ).sort((a,b) => this.contactViewSort(a,b))
  }

  filterContactViews(
    contacts: ContactView[],
    searchTerm: string
  ): ContactView[] {
    return contacts.filter((item) =>
      StringUtils.contains(item.contact.name, searchTerm)
    )
  }

  private contactViewSort(a: ContactView, b: ContactView) {
    const bComesFirst = 1
    const aComesFirst = -1

    const sortByName = () => {
      return a.contact.name > b.contact.name ? bComesFirst : aComesFirst
    }

    const aIsEssential = Utils.isNotEmpty(a.contact.localEssentialContactId)
    const bIsEssential = Utils.isNotEmpty(b.contact.localEssentialContactId)

    if (aIsEssential) {
      if (bIsEssential) {
        return sortByName()
      } else {
        return aComesFirst
      }
    } else if (bIsEssential) {
      return bComesFirst
    }

    return sortByName()
  }
}

export default new ContactServiceImpl()
