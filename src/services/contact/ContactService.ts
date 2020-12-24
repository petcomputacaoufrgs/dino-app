import ContactDataModel from '../../types/contact/api/ContactDataModel'
import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import ContactEntity from '../../types/contact/database/ContactEntity'
import ContactRepository, {
  ContactRepositoryImpl,
} from '../../storage/database/contact/ContactRepository'
import SynchronizableService from '../synchronizable/SynchronizableService'
import APIWebSocketDestConstants from '../../constants/api/APIWebSocketDestConstants'
import PhoneEntity from '../../types/contact/database/PhoneEntity'
import GoogleContactEntity from '../../types/contact/database/GoogleContactEntity'
import StringUtils from '../../utils/StringUtils'
import ContactView from '../../types/contact/view/ContactView'
import PhoneService from './PhoneService'
import GoogleContactService from './GoogleContactService'

export class ContactServiceImpl extends SynchronizableService<
  number,
  number,
  ContactDataModel,
  ContactEntity,
  ContactRepositoryImpl
> {
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

  getViewContactByFilter = (
    contacts: ContactEntity[],
    phones: PhoneEntity[],
    googleContacts: GoogleContactEntity[],
    searchTerm: string
  ): ContactView[] => {
    const contactsFiltered = contacts.filter((item) =>
      StringUtils.contains(item.name, searchTerm)
    )

    return contactsFiltered.map(
      (contact) =>
        ({
          contact: contact,
          phones: PhoneService.getByContact(contact, phones),
          googleContact: GoogleContactService.getByContact(
            contact,
            googleContacts
          ),
        } as ContactView)
    )
  }
}

export default new ContactServiceImpl(
  ContactRepository,
  APIRequestMappingConstants.CONTACT,
  APIWebSocketDestConstants.CONTACT_UPDATE,
  APIWebSocketDestConstants.CONTACT_DELETE
)
