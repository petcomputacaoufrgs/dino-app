import GoogleAgentService from '../../agent/GoogleAgentService'
import GooglePeopleAPIURLConstants from '../../constants/google/GooglePeopleAPIURLConstants'
import LogAppErrorService from '../log_app_error/LogAppErrorService'
import GooglePeopleModel from '../../types/google_api/people/GooglePeopleModel'
import ContactModel from '../../types/contact/ContactModel'
import AuthService from '../auth/AuthService'
import GoogleScope from '../../types/auth/google/GoogleScope'
import ContactService from './ContactService'

class ContactGoogleService {
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
  }

  private saveContactOnGoogleAPI = async (
    contact: ContactModel
  ): Promise<ContactModel> => {
    if (this.hasContactGrant()) {
      const peopleModel = this.createPeopleFromContactModel(contact)

      try {
        const etag = await this.getCurrentEtag(contact)

        const response =
          etag && contact.resourceName
            ? await this.updateContactRequest(
                peopleModel,
                contact.resourceName,
                etag
              )
            : await this.createContactRequest(peopleModel)
        if (response && response.resourceName) {
          contact.resourceName = response.resourceName
        }
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }

    return contact
  }

  private deleteContactOnGoogleAPI = async (resourceName: string) => {
    if (this.hasContactGrant()) {
      try {
        const success = await this.deleteContactRequest(resourceName)

        if (!success) {
          ContactService.pushToResourceNamesToDelete(resourceName)
        }
      } catch (e) {
        LogAppErrorService.logError(e)
        ContactService.pushToResourceNamesToDelete(resourceName)
      }
    }
  }

  private hasContactGrant = (): boolean => {
    const scopes = AuthService.getGoogleAuthScopes()

    if (scopes) {
      return scopes.some((scope) => scope === GoogleScope.SCOPE_CONTACT)
    }

    return false
  }

  private createContactRequest = async (
    model: GooglePeopleModel
  ): Promise<GooglePeopleModel | undefined> => {
    const request = await GoogleAgentService.post(
      GooglePeopleAPIURLConstants.CREATE_CONTACT
    )

    if (request.canGo) {
      const response = await request.authenticate().setBody(model).go()

      return response.body
    }

    return undefined
  }

  private getContactRequest = async (
    resourceName: string
  ): Promise<GooglePeopleModel | undefined> => {
    const request = await GoogleAgentService.get(
      GooglePeopleAPIURLConstants.GET_CONTACT(resourceName)
    )
    if (request.canGo) {
      const response = await request.authenticate().go()
      return response.body
    }

    return undefined
  }

  private updateContactRequest = async (
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
      const response = await request.authenticate().setBody(model).go()
      return response.body
    }

    return undefined
  }

  private deleteContactRequest = async (
    resourceName: string
  ): Promise<boolean> => {
    const request = await GoogleAgentService.delete(
      GooglePeopleAPIURLConstants.DELETE_CONTACT(resourceName)
    )

    if (request.canGo) {
      await request.authenticate().go()
      return true
    }

    return false
  }

  private createPeopleFromContactModel = (
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

  private getCurrentEtag = async (
    contact: ContactModel
  ): Promise<string | undefined> => {
    if (contact.resourceName) {
      const googleSavedContact = await this.getContactRequest(
        contact.resourceName
      )

      if (googleSavedContact) {
        return googleSavedContact.etag
      }
    }

    return undefined
  }
}

export default new ContactGoogleService()
