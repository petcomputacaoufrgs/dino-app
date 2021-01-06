import GoogleAgentService from '../../agent/GoogleAgentService'
import GooglePeopleAPIURLConstants from '../../constants/google/GooglePeopleAPIURLConstants'
import GooglePeopleModel from '../../types/google_api/people/GooglePeopleModel'
import ContactService from './ContactService'
import GoogleContactRepository, {
  GoogleContactRepositoryImpl,
} from '../../storage/database/contact/GoogleContactRepository'
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

export class GoogleContactServiceImpl extends AutoSynchronizableService<
  number,
  GoogleContactDataModel,
  GoogleContactEntity,
  GoogleContactRepositoryImpl
> {
  constructor() {
    super(
      GoogleContactRepository, 
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
      }

      return entity
    }
  }

  async convertEntityToModel(
    entity: GoogleContactEntity
  ): Promise<GoogleContactDataModel | undefined> {
    if (entity.localContactId) {
      const contact = await ContactService.getByLocalId(entity.localContactId)

      if (contact && contact.id && entity.resourceName) {
        const model: GoogleContactDataModel = {
          resourceName: entity.resourceName,
          contactId: contact.id,
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

  private saveContactOnGoogleAPI = async (
    entity: GoogleContactEntity,
    contact: ContactEntity, 
    phones: PhoneEntity[]
  ) => {
    const peopleModel = this.convertToGooglePeopleModel(contact, phones)

    const etag = await this.getCurrentGooglePeopleEtag(entity.resourceName)

    const response = etag && entity.resourceName? 
      await this.updateContactOnGoogleAPI(
        peopleModel,
        entity.resourceName,
        etag) : await this.createContactOnGoogleAPI(peopleModel)

    if (response && response.resourceName) {
      entity.resourceName = response.resourceName
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
