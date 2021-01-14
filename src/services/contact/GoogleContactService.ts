import GoogleAgentService from '../../agent/GoogleAgentService'
import GooglePeopleAPIURLConstants from '../../constants/google/GooglePeopleAPIURLConstants'
import GooglePeopleModel from '../../types/google_api/people/GooglePeopleModel'
import ContactService from './ContactService'
import GoogleContactEntity from '../../types/contact/database/GoogleContactEntity'
import GoogleContactDataModel from '../../types/contact/api/GoogleContactDataModel'
import AutoSynchronizableService from '../sync/AutoSynchronizableService'
import APIRequestMappingConstants from '../../constants/api/APIRequestMappingConstants'
import APIWebSocketDestConstants from '../../constants/api/APIWebSocketDestConstants'
import ContactEntity from '../../types/contact/database/ContactEntity'
import PhoneEntity from '../../types/contact/database/PhoneEntity'
import GoogleScopeService from '../auth/google/GoogleScopeService'
import PhoneService from './PhoneService'
import LogAppErrorService from '../log_app_error/LogAppErrorService'
import SynchronizableService from '../sync/SynchronizableService'
import WebSocketQueueURLService from '../websocket/path/WebSocketQueuePathService'
import Database from '../../storage/database/Database'
import Utils from '../../utils/Utils'

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
    return [ContactService]
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

  protected async onDeleteOnAPI(entity: GoogleContactEntity) {
    try {
      const hasContactGrant = await GoogleScopeService.findContactGrant() !== undefined

      if (!hasContactGrant) {
        return 
      }
  
      if (entity.resourceName) {
        await this.deleteContactOnGoogleAPI(entity.resourceName)
      }
    } catch (e) {
      LogAppErrorService.logError(e)
    }
  }

  protected async onSaveOnAPI(entity: GoogleContactEntity) {
    try {
      if (entity.localContactId === undefined) {
        return
      }
  
      const hasContactGrant = await GoogleScopeService.findContactGrant() !== undefined
  
      if (!hasContactGrant) {
        return 
      }
  
      const contact = await ContactService.getByLocalId(entity.localContactId)
  
      if (!contact) {
        return
      }
  
      const phones = await PhoneService.getAllByContactLocalId(entity.localContactId)
  
      await this.saveContactOnGoogleAPI(entity, contact, phones)
    } catch (e) {
      LogAppErrorService.logError(e)
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

  private saveContactOnGoogleAPI = async (
    entity: GoogleContactEntity,
    contact: ContactEntity, 
    phones: PhoneEntity[]
  ) => {
    try {
      const peopleModel = this.convertToGooglePeopleModel(contact, phones)

      const etag = await this.getCurrentGooglePeopleEtag(entity.resourceName)
  
      const response = etag && entity.resourceName ? 
        await this.updateContactOnGoogleAPI(
          peopleModel,
          entity.resourceName,
          etag) : await this.createContactOnGoogleAPI(peopleModel)
  
      if (response && response.resourceName) {
        entity.resourceName = response.resourceName
        entity.savedOnGoogleAPI = response.resourceName ? 1 : 0
        console.log("salvou")
      }
    } catch (e) {
      LogAppErrorService.logError(e)
    }
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

  private createContactOnGoogleAPI = async (
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

  private updateContactOnGoogleAPI = async (
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

  private deleteContactOnGoogleAPI = async (
    resourceName: string
  ) => {
    try {
      const request = await GoogleAgentService.delete(
        GooglePeopleAPIURLConstants.DELETE_CONTACT(resourceName)
      )
  
      if (request.canGo) {
        const authRequest = await request.authenticate()
        await authRequest.go()
      }
    } catch (e) {
      LogAppErrorService.logError(e)
    }
  }

  private convertToGooglePeopleModel = (
    contact: ContactEntity,
    phones: PhoneEntity[]
  ): GooglePeopleModel => {
    const model: GooglePeopleModel = {
      names: [
        {
          givenName: contact.name,
        },
      ],
      phoneNumbers: phones.map((phone) => ({
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
    resourceName: string | undefined
  ): Promise<string | undefined> => {
    if (resourceName) {
      const response = await this.getContactOnGoogleAPIRequest(
        resourceName
      )
    
      if (response) {
        return response.etag
      }
    }
  }
}

export default new GoogleContactServiceImpl()
