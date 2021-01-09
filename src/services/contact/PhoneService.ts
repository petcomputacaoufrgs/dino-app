import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import APIWebSocketDestConstants from '../../constants/api/APIWebSocketDestConstants'
import ContactsConstants from '../../constants/contact/ContactsConstants'
import LanguageBase from '../../constants/languages/LanguageBase'
import PhoneDataModel from '../../types/contact/api/PhoneDataModel'
import ContactEntity from '../../types/contact/database/ContactEntity'
import PhoneEntity from '../../types/contact/database/PhoneEntity'
import ArrayUtils from '../../utils/ArrayUtils'
import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import ContactService from './ContactService'
import ContactView from '../../types/contact/view/ContactView'
import SynchronizableService from '../sync/SynchronizableService'
import WebSocketQueueURLService from '../websocket/path/WebSocketQueuePathService'
import Database from '../../storage/database/Database'
import EssentialContactService from './EssentialContactService'

export class PhoneServiceImpl extends AutoSynchronizableService<
  number,
  PhoneDataModel,
  PhoneEntity
> {  
  constructor() {
    super(
      Database.phone, 
      APIRequestMappingConstants.PHONE, 
      WebSocketQueueURLService,
      APIWebSocketDestConstants.PHONE
    )
  }

  getSyncDependencies(): SynchronizableService[] {
    return [ContactService]
  }

  async convertModelToEntity(
    model: PhoneDataModel
  ): Promise<PhoneEntity | undefined> {

    let contactId = model.contactId
    let essentialContactId = model.essentialContactId

    if(contactId) {

      const contact = await ContactService.getById(contactId)
      contactId = contact?.localId
      
    } else if(essentialContactId) {

      const essentialContact = await EssentialContactService.getById(essentialContactId)
      essentialContactId = essentialContact?.localId

    } else return;

      const entity: PhoneEntity = {
        number: model.number,
        type: model.type,
        localContactId: contactId,
        localEssentialContactId: essentialContactId,
      }

      return entity
  }

  async convertEntityToModel(
    entity: PhoneEntity
  ): Promise<PhoneDataModel | undefined> {
    
    let localContactId = entity.localContactId
    let localEssentialContactId = entity.localEssentialContactId

    if (localContactId) {

      const contact = await ContactService.getByLocalId(localContactId)
      localContactId = contact?.localId

    } else if (localEssentialContactId) {

      const essentialContact = await EssentialContactService.getByLocalId(localEssentialContactId)
      localEssentialContactId = essentialContact?.localId

    } else return;

    const model: PhoneDataModel = {
      number: entity.number,
      type: entity.type,
      contactId: localContactId,
      essentialContactId: localEssentialContactId,
    }

      return model
  }

  async getAllByContactLocalId(localContactId: number): Promise<PhoneEntity[]> {
    return this.table.where('localContactId').equals(localContactId).toArray()
  }

  getPhoneTypes = (
    phones: Array<PhoneEntity>,
    language: LanguageBase
  ): string => {
    if (phones.length > 0) {
      const types = ArrayUtils.removeRepeatedValues(
        phones.map((phone) => phone.type)
      )

      return types.map((type) => this.getPhoneType(type, language)).toString()
    }
    return ''
  }

  getPhoneType = (type: number, language: LanguageBase): string => {
    switch (type) {
      case ContactsConstants.PUBLIC_SERVICE:
        return language.CONTACTS_PUBLIC_SERVICE_PHONE

      case ContactsConstants.RESIDENTIAL:
        return language.CONTACTS_RESIDENTIAL_PHONE

      default:
        return language.CONTACTS_MOBILE_PHONE
    }
  }

  getByContact(
    contact: ContactEntity,
    phones: PhoneEntity[]
  ): PhoneEntity[] | undefined {
    if (contact.localId) {
      return phones.filter((phone) => phone.localContactId === contact.localId)
    }
  }

  getContactWithSamePhone(
    itens: ContactView[],
    newPhones: PhoneEntity[],
    currentContact?: ContactView
  ): ContactView | undefined {
    return itens.find(
      (item) =>
        (!currentContact ||
          item.contact.localId !== currentContact.contact.localId) &&
        item.phones.some((phone) =>
          newPhones.some((newPhone) => newPhone.number.includes(phone.number))
        )
    )
  }
}

export default new PhoneServiceImpl()
