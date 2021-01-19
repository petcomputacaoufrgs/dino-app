import ContactService from './ContactService'
import GoogleContactEntity from '../../types/contact/database/GoogleContactEntity'
import GoogleContactDataModel from '../../types/contact/api/GoogleContactDataModel'
import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import APIWebSocketDestConstants from '../../constants/api/APIWebSocketDestConstants'
import ContactEntity from '../../types/contact/database/ContactEntity'
import SynchronizableService from '../sync/SynchronizableService'
import WebSocketQueueURLService from '../websocket/path/WebSocketQueuePathService'
import Database from '../../storage/database/Database'
import Utils from '../../utils/Utils'
import PhoneService from './PhoneService'

export class GoogleContactServiceImpl extends AutoSynchronizableService<
  number,
  GoogleContactDataModel,
  GoogleContactEntity
> {
  constructor() {
    super(
      Database.googleContact, 
      APIRequestMappingConstants.GOOGLE_CONTACT,
      WebSocketQueueURLService,
      APIWebSocketDestConstants.GOOGLE_CONTACT
    )
  }

  getSyncDependencies(): SynchronizableService[] {
    return [ContactService, PhoneService]
  }

  async convertModelToEntity(
    model: GoogleContactDataModel
  ): Promise<GoogleContactEntity | undefined> {
    const contact = await ContactService.getById(model.contactId)

    if (contact) {
      const entity: GoogleContactEntity = {
        resourceName: model.resourceName,
        localContactId: contact.localId,
        savedOnGoogleAPI: model.resourceName ? 1 : 0
      }

      return entity
    }
  }

  async convertEntityToModel(
    entity: GoogleContactEntity
  ): Promise<GoogleContactDataModel | undefined> {
    if (entity.localContactId) {
      const contact = await ContactService.getByLocalId(entity.localContactId)

      if (contact && Utils.isNotEmpty(contact.id)) {
        const model: GoogleContactDataModel = {
          resourceName: entity.resourceName,
          contactId: contact.id!,
        }

        return model
      }
    }
  }

  getByContact(
    contact: ContactEntity,
    googleContacts: GoogleContactEntity[]
  ): GoogleContactEntity | undefined {
    if (contact.localId) {
      return googleContacts.find(
        (googleContact) => googleContact.localContactId === contact.localId
      )
    }
  }

  async saveGoogleContact(contact: ContactEntity, googleContact?: GoogleContactEntity) {
    if (googleContact) {
      await this.save(googleContact)
    } else {
      const newGoogleContact: GoogleContactEntity = {
        localContactId: contact.localId,
        savedOnGoogleAPI: 0
      }
      await this.save(newGoogleContact)
    }
  }

  async deleteByContact(
    contact: ContactEntity
  ) {
    if (Utils.isNotEmpty(contact.localId)) {
      const googleContact = await this.table.where('localContactId').equals(contact.localId!).first()

      if (googleContact) {
        await this.delete(googleContact)
      }
    }
  }

  async activeGoogleContactsGrant() {
    const notSavedGoogleContacts = await this.table.where('savedOnGoogleAPI').equals(0).toArray()

    this.saveAll(notSavedGoogleContacts)
  }
}

export default new GoogleContactServiceImpl()
