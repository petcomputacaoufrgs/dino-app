import ContactModel from '../../types/contact/ContactModel'
import SaveResponseModelAll from '../../types/contact/SaveResponseModelAll'
import SaveResponseModel from '../../types/contact/SaveResponseModel'
import ContactResponseModel from '../../types/contact/ContactResponseModel'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import HttpStatus from 'http-status-codes'
import DinoAgentService from '../../agent/DinoAgentService'
import Service from './ContactService'
import LogAppErrorService from '../log_app_error/LogAppErrorService'
import ContactGoogleResourceNameModel from '../../types/contact/ContactGoogleResourceNameModel'
import ContactGoogleResourceNamesModel from '../../types/contact/ContactGoogleResourceNamesModel'
import ContactGoogleService from './ContactGoogleService'

class ContactServerService {
  updateServer = async () => {
    let sucessfulAdd = true
    let sucessfulEdit = true
    let idsToUpdate = Service.getIdsToUpdate()

    if (idsToUpdate.length > 0) {
      const contacts = Service.getItems()
      const contactsToUpdate = Service.getContactsToUpdate(
        contacts,
        idsToUpdate
      )

      if (contactsToUpdate.toAdd.length > 0) {
        const responseSaveModel = await this.saveContacts(
          contactsToUpdate.toAdd
        )

        if (responseSaveModel !== undefined) {
          const version = responseSaveModel.version
          const responseContactModels = responseSaveModel.contactResponseModels

          if (version !== undefined && responseContactModels !== undefined) {
            Service.setVersion(version)
            Service.updateContactIds(responseContactModels, contacts)
            ContactGoogleService.createNewsContacts(responseContactModels)
          }
        } else sucessfulAdd = false
      }

      if (contactsToUpdate.toEdit.length > 0) {
        const version = await this.editContacts(contactsToUpdate.toEdit)

        if (version !== undefined) {
          Service.setVersion(version)
        } else sucessfulEdit = false
      }

      if (sucessfulAdd && sucessfulEdit) Service.cleanUpdateQueue()
    }

    const idsToDelete = Service.getIdsToDelete()

    if (idsToDelete.length > 0) {
      const version = await this.deleteContacts(Service.getContactsToDelete())

      if (version !== undefined) {
        Service.setVersion(version)
        Service.cleanDeleteQueue()
      }
    }
  }

  saveContact = async (
    contactModel: ContactModel
  ): Promise<ContactResponseModel | undefined> => {
    const request = await DinoAgentService.post(
      DinoAPIURLConstants.CONTACT_SAVE
    )

    if (request.canGo) {
      try {
        const response = await request.authenticate().setBody(contactModel).go()

        if (response.status === HttpStatus.OK) {
          const responseSaveModel = response.body as SaveResponseModel

          Service.setVersion(responseSaveModel.version)
          return responseSaveModel.contactResponseModel
        }
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }
    Service.pushToUpdate(contactModel.frontId)
    return undefined
  }

  saveContacts = async (
    contactModels: Array<ContactModel>
  ): Promise<SaveResponseModelAll | undefined> => {
    const request = await DinoAgentService.post(
      DinoAPIURLConstants.CONTACT_SAVE_ALL
    )

    if (request.canGo) {
      try {
        const response = await request
          .authenticate()
          .setBody(contactModels)
          .go()

        if (response.status === HttpStatus.OK) {
          return response.body as SaveResponseModelAll
        }
      } catch (e) {
        LogAppErrorService.logError(e)
      }
      return undefined
    }
  }

  editContact = async (contactModel: ContactModel) => {
    const request = await DinoAgentService.put(DinoAPIURLConstants.CONTACT_EDIT)

    if (request.canGo) {
      try {
        const response = await request.authenticate().setBody(contactModel).go()

        if (response.status === HttpStatus.OK) {
          Service.setVersion(response.body)
          return
        }
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }

    Service.pushToUpdate(contactModel.frontId)
  }

  editContacts = async (
    contactModels: Array<ContactModel>
  ): Promise<number | undefined> => {
    const request = await DinoAgentService.put(
      DinoAPIURLConstants.CONTACT_EDIT_ALL
    )

    if (request.canGo) {
      try {
        const response = await request
          .authenticate()
          .setBody(contactModels)
          .go()

        if (response.status === HttpStatus.OK) {
          return response.body
        }
      } catch (e) {
        LogAppErrorService.logError(e)
      }

      return undefined
    }
  }

  deleteContact = async (contactId: number) => {
    const request = await DinoAgentService.delete(
      DinoAPIURLConstants.CONTACT_DELETE
    )

    if (request.canGo) {
      try {
        const response = await request
          .authenticate()
          .setBody({ id: contactId })
          .go()

        if (response.status === HttpStatus.OK) {
          Service.setVersion(response.body)
          return
        }
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }
    Service.pushToDelete(contactId)
  }

  deleteContacts = async (
    contactIds: { id: number }[]
  ): Promise<number | undefined> => {
    const request = await DinoAgentService.delete(
      DinoAPIURLConstants.CONTACT_DELETE_ALL
    )

    if (request.canGo) {
      try {
        const response = await request.authenticate().setBody(contactIds).go()

        if (response.status === HttpStatus.OK) {
          return response.body
        }
      } catch (e) {
        LogAppErrorService.logError(e)
      }

      return undefined
    }
  }

  getVersion = async (): Promise<number | undefined> => {
    const request = await DinoAgentService.get(
      DinoAPIURLConstants.CONTACT_VERSION
    )

    if (request.canGo) {
      try {
        const response = await request.authenticate().go()

        const version: number = response.body

        return version
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }

    return undefined
  }

  saveGoogleResourceName = async (model: ContactGoogleResourceNameModel) => {
    const request = await DinoAgentService.post(
      DinoAPIURLConstants.CONTACT_GOOGLE_RESOURCE_NAME_SAVE
    )

    if (request.canGo) {
      try {
        await request.authenticate().setBody(model).go()
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }
  }

  saveGoogleResourceNames = async (model: ContactGoogleResourceNamesModel) => {
    const request = await DinoAgentService.post(
      DinoAPIURLConstants.CONTACT_GOOGLE_RESOURCE_NAMES_SAVE
    )

    if (request.canGo) {
      try {
        await request.authenticate().setBody(model).go()
      } catch (e) {
        LogAppErrorService.logError(e)
      }
    }
  }
}

export default new ContactServerService()
