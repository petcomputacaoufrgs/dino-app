import APIRequestMappingConstants from "../../constants/api/APIRequestMappingConstants"
import APIWebSocketDestConstants from "../../constants/api/APIWebSocketDestConstants"
import ContactsConstants from "../../constants/contact/ContactsConstants"
import LanguageBase from "../../constants/languages/LanguageBase"
import PhoneRepository, { PhoneRepositoryImpl } from "../../storage/database/contact/PhoneRepository"
import PhoneModel from "../../types/contact/api/PhoneModel"
import ContactEntity from '../../types/contact/database/ContactEntity';
import PhoneEntity from "../../types/contact/database/PhoneEntity"
import ArrayUtils from "../../utils/ArrayUtils"
import SynchronizableService from "../synchronizable/SynchronizableService"
import ContactService from "./ContactService"
import ContactView from '../../types/contact/view/ContactView';

export class PhoneServiceImpl extends SynchronizableService<
number,
number,
PhoneModel,
PhoneEntity,
PhoneRepositoryImpl
> {
  async convertModelToEntity(model: PhoneModel): Promise<PhoneEntity | undefined> {
    const contact = await ContactService.getById(model.contactId)

    if (contact) {
      const entity: PhoneEntity = {
        number: model.number,
        type: model.type,
        localContactId: contact.localId
      }
  
      return entity  
    }
  }

  async convertEntityToModel(entity: PhoneEntity): Promise<PhoneModel | undefined> {
    if (entity.localContactId) {
      const contact = await ContactService.getByLocalId(entity.localContactId)

      if (contact && contact.id) {
        const model: PhoneModel = {
          number: entity.number,
          type: entity.type,
          contactId: contact.id
        }
      
        return model
      }
    }
  }

  async getAllByContactLocalId(localId: number) {
    this.repository.getAllByContactLocalId(localId)
  }

  getPhoneTypes = (phones: Array<PhoneEntity>, language: LanguageBase): string => {
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

  getByContact(contact: ContactEntity, phones: PhoneEntity[]): PhoneEntity[] | undefined {
    if (contact.localId) {
      return phones.filter(phone => phone.localContactId === contact.localId)
    }
  }

  getContactWithSamePhone(itens: ContactView[], newPhones: PhoneEntity[], currentContact?: ContactView): ContactView | undefined {
    return itens.find(item => (!currentContact || item.contact.localId !== currentContact.contact.localId) && 
      item.phones.some(phone => newPhones.some(newPhone => newPhone.number.includes(phone.number))))
  }
}

export default new PhoneServiceImpl(
  PhoneRepository,
  APIRequestMappingConstants.PHONE,
  APIWebSocketDestConstants.PHONE_UPDATE,
  APIWebSocketDestConstants.PHONE_DELETE
)