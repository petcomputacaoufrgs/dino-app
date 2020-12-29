import GoogleAgentService from '../../agent/GoogleAgentService'
import GooglePeopleAPIURLConstants from '../../constants/google/GooglePeopleAPIURLConstants'
import GooglePeopleModel from '../../types/google_api/people/GooglePeopleModel'
import ContactService from './ContactService'
import GoogleContactRepository, {
  GoogleContactRepositoryImpl,
} from '../../storage/database/contact/GoogleContactRepository'
import GoogleContactEntity from '../../types/contact/database/GoogleContactEntity'
import GoogleContactModel from '../../types/contact/api/GoogleContactModel'
import SynchronizableService from '../synchronizable/SynchronizableService'
import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import APIWebSocketDestConstants from '../../constants/api/APIWebSocketDestConstants'
import ContactEntity from '../../types/contact/database/ContactEntity'

export class GoogleContactServiceImpl extends SynchronizableService<
  number,
  number,
  GoogleContactModel,
  GoogleContactEntity,
  GoogleContactRepositoryImpl
> {
  async convertModelToEntity(
    model: GoogleContactModel
  ): Promise<GoogleContactEntity | undefined> {
    const contact = await ContactService.getById(model.contactId)

    if (contact) {
      const entity: GoogleContactEntity = {
        resourceName: model.resourceName,
        localContactId: contact.localId,
      }

      return entity
    }
  }

  async convertEntityToModel(
    entity: GoogleContactEntity
  ): Promise<GoogleContactModel | undefined> {
    if (entity.localContactId) {
      const contact = await ContactService.getByLocalId(entity.localContactId)

      if (contact && contact.id) {
        const model: GoogleContactModel = {
          resourceName: entity.resourceName,
          contactId: contact.id,
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

  /*
  saveContact = async (contact: ContactModel): Promise<ContactModel> => {
    return await this.saveContactOnGoogleAPI(contact)
  }

  saveContacts = async (contacts: ContactModel[]): Promise<ContactModel[]> => {
    return await Promise.all(
      contacts.map((contact) => this.saveContactOnGoogleAPI(contact))
    )
  }

  deleteContact = async (contact: ContactModel) => {
    if (contact.resourceName) {
      await this.deleteContactOnGoogleAPI(contact.resourceName)
    }
  }

  deleteContacts = async (resourceNames: string[]) => {
    await Promise.all(
      resourceNames.map((resourceName) =>
        this.deleteContactOnGoogleAPI(resourceName)
      )
    )
  }*/

  /*
  private saveContactOnGoogleAPI = async (
    contact: ContactModel
  ): Promise<ContactModel> => {
    if (this.hasContactGrant()) {
      const peopleModel = this.createGooglePeopleFromContactModel(contact)

      try {
        const etag = await this.getCurrentGooglePeopleEtag(contact)

        const response =
          etag && contact.resourceName
            ? await this.updateContactOnGoogleAPIRequest(
                peopleModel,
                contact.resourceName,
                etag
              )
            : await this.createContactOnGoogleAPIRequest(peopleModel)
        if (response && response.resourceName) {
          contact.resourceName = response.resourceName
        }
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }

    return contact
  }
  */

  private createContactOnGoogleAPIRequest = async (
    model: GooglePeopleModel
  ): Promise<GooglePeopleModel | undefined> => {
    const request = await GoogleAgentService.post(
      GooglePeopleAPIURLConstants.CREATE_CONTACT
    )

    if (request.canGo) {
      const authRequest = await request.authenticate()
      
      const response = await authRequest.setBody(model).go()

      return response.body
    }

    return undefined
  }

  private getContactOnGoogleAPIRequest = async (
    resourceName: string
  ): Promise<GooglePeopleModel | undefined> => {
    const request = await GoogleAgentService.get(
      GooglePeopleAPIURLConstants.GET_CONTACT(resourceName)
    )
    if (request.canGo) {
      const authRequest = await request.authenticate()
      
      const response = await authRequest.go()

      return response.body
    }

    return undefined
  }

  private updateContactOnGoogleAPIRequest = async (
    model: GooglePeopleModel,
    resourceName: string,
    etag: string
  ): Promise<GooglePeopleModel | undefined> => {
    const request = await GoogleAgentService.patch(
      GooglePeopleAPIURLConstants.UPDATE_CONTACT(resourceName)
    )
    if (request.canGo) {
      model.resourceName = resourceName
      model.etag = etag
      const authRequest = await request.authenticate()
      
      const response = await authRequest.setBody(model).go()

      return response.body
    }

    return undefined
  }

  private deleteContactOnGoogleAPIRequest = async (
    resourceName: string
  ): Promise<boolean> => {
    const request = await GoogleAgentService.delete(
      GooglePeopleAPIURLConstants.DELETE_CONTACT(resourceName)
    )

    if (request.canGo) {
      const authRequest = await request.authenticate()
      
      await authRequest.go()
      return true
    }

    return false
  }

  /*
  private createGooglePeopleFromContactModel = (
    contact: ContactModel
  ): GooglePeopleModel => {
    const model: GooglePeopleModel = {
      names: [
        {
          givenName: contact.name,
        },
      ],
      phoneNumbers: contact.phones.map((phone) => ({
        value: phone.number,
      })),
    }

    if (contact.description) {
      model.biographies = [
        {
          value: contact.description,
          contentType: 'TEXT_PLAIN',
        },
      ]
    }

    return model
  }

  private getCurrentGooglePeopleEtag = async (
    contact: ContactModel
  ): Promise<string | undefined> => {
    if (contact.resourceName) {
      const googleSavedContact = await this.getContactOnGoogleAPIRequest(
        contact.resourceName
      )

      if (googleSavedContact) {
        return googleSavedContact.etag
      }
    }

    return undefined
  }
  */
}

export default new GoogleContactServiceImpl(
  GoogleContactRepository,
  APIRequestMappingConstants.GOOGLE_CONTACT,
  APIWebSocketDestConstants.GOOGLE_CONTACT_UPDATE,
  APIWebSocketDestConstants.GOOGLE_CONTACT_DELETE
)
