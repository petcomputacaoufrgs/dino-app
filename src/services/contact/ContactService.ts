import ContactsConstants from '../../constants/contact/ContactsConstants'
import PhoneModel from '../../types/contact/api/GoogleContactModel'
import ContactModel from '../../types/contact/api/ContactModel'
import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import LanguageBase from '../../constants/languages/LanguageBase'
import ArrayUtils from '../../utils/ArrayUtils'
import ContactEntity from '../../types/contact/database/ContactEntity'
import ContactRepository, { ContactRepositoryImpl } from '../../storage/database/contact/ContactRepository'
import SynchronizableService from '../synchronizable/SynchronizableService'
import APIWebSocketDestConstants from '../../constants/api/APIWebSocketDestConstants'

export class ContactServiceImpl extends SynchronizableService<
number,
number,
ContactModel,
ContactEntity,
ContactRepositoryImpl
> {

  async convertModelToEntity(model: ContactModel): Promise<ContactEntity> {
    const entity: ContactEntity = {
      name: model.name,
      description: model.description,
      color: model.color,
    }

    return entity
  }

  async convertEntityToModel(entity: ContactEntity): Promise<ContactModel> {
    const model: ContactModel = {
      name: entity.name,
      description: entity.description,
      color: entity.color,
    }

    return model
  }

  //#region UPDATE QUEUE

  // getContactsToUpdate = (contacts: ContactEntity[], idsToUpdate: number[]): { toAdd: ContactEntity[]; toEdit: ContactEntity[] } => {
  //   return contacts
  //     .filter((contact) => idsToUpdate.includes(contact.localId))
  //     .reduce((acc, contact) => {
  //         const toAddOrEdit = contact.id === undefined ? 'toAdd' : 'toEdit'
  //         acc[toAddOrEdit].push(contact)
  //         return acc
  //       }, { toAdd: Array<ContactEntity>(), toEdit: Array<ContactEntity>() }
  //     )
  // }

  changed = (item: ContactEntity, edited: ContactEntity): boolean => {
    let changed = false

    // if (item.phones.length === edited.phones.length) {
    //   changed = item.phones.some(
    //     (phone, index) => 
    //     phone.number !== edited.phones[index].number 
    //     || phone.type !== edited.phones[index].type
    //   )
    // } else changed = true

    if (item.name !== edited.name) changed = true
    if (item.description !== edited.description) changed = true
    if (item.color !== edited.color) changed = true

    return changed
  }

  getPhoneTypes = (phones: Array<PhoneModel>, language: LanguageBase): string => {
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
}

export default new ContactServiceImpl(
  ContactRepository,
  APIRequestMappingConstants.CONTACT,
  APIWebSocketDestConstants.CONTACT_UPDATE,
  APIWebSocketDestConstants.CONTACT_DELETE
)