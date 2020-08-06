import ContactModel from '../../types/contact/ContactModel'
import ResponseSaveModel from '../../types/contact/ResponseSaveModel'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import HttpStatus from 'http-status-codes'
import DinoAgentService from '../../agent/DinoAgentService'
import AgentStatus from '../../types/agent/AgentStatus'
import Service from './ContactService'


class ContactServerService {

  updateServer = async () => {

    let sucessfulAdd = true
    let sucessfulEdit = true
    let idsToUpdate = Service.getIdsToUpdate()

        if(idsToUpdate.length > 0) {

          const contacts = Service.getItems()
          const contactsToUpdate = Service.getContactsToUpdate(contacts, idsToUpdate)

          if(contactsToUpdate.toAdd.length > 0) {
            
            const responseSaveModel = await this.saveContacts(contactsToUpdate.toAdd)
            
            if(responseSaveModel !== undefined) {
              
              const version = responseSaveModel.version
              const responseModels = responseSaveModel.responseModels

              if(version !== undefined && responseModels !== undefined) {
                Service.setVersion(version)
                Service.updateContactIds(responseModels, contacts)
              }

            } else sucessfulAdd = false
          }

          if(contactsToUpdate.toEdit.length > 0) {
            
            const version = await this.editContacts(contactsToUpdate.toEdit)
            
            if (version !== undefined) {
              Service.setVersion(version)

            } else sucessfulEdit = false  
          }

          if(sucessfulAdd && sucessfulEdit) 
            Service.cleanUpdateQueue()
          else Service.setContactsToUpdate(contactsToUpdate.toEdit.concat(contactsToUpdate.toAdd))
        }

        const idsToDelete = Service.getIdsToDelete()

        if(idsToDelete.length > 0) {

          const version = await this.deleteContacts(idsToDelete)

          if (version !== undefined) {
            Service.setVersion(version)
            Service.cleanDeleteQueue()
          }
        }
  }

  saveContacts = async (contactModels: Array<ContactModel>): Promise<ResponseSaveModel | undefined> => {
    const request = await DinoAgentService.post(DinoAPIURLConstants.CONTACT_SAVE_ALL)

    if (request.status === AgentStatus.OK) {
      try {
        const response = await request.get()!.send(contactModels)

        if (response.status === HttpStatus.OK) {
          const responseSaveModel = response.body as ResponseSaveModel

          return responseSaveModel
        }
      } catch {
        /**TO-DO Fazer log de erro */
      }

      return undefined
    }
  }

  editContacts = async (contactModels: Array<ContactModel>): Promise<number | undefined> => {

    const request = await DinoAgentService.put(DinoAPIURLConstants.CONTACT_EDIT_ALL)

    if (request.status === AgentStatus.OK) {
      try {
        const response = await request.get()!.send(contactModels)

        if (response.status === HttpStatus.OK) {
          return response.body
        }
      } catch {
        /**TO-DO Fazer log de erro */
      }

      return undefined
    }
  }

  deleteContacts = async (contactIds: {id: number}[]): Promise<number | undefined> => {

    const request = await DinoAgentService.delete(DinoAPIURLConstants.CONTACT_EDIT_ALL)

    if (request.status === AgentStatus.OK) {
      try {
        const response = await request.get()!.send(contactIds)

        if (response.status === HttpStatus.OK) {
          return response.body
        }
      } catch {
        /**TO-DO Fazer log de erro */
      }

      return undefined
    }
  }

  getVersion = async (): Promise<number | undefined> => {
    const request = await DinoAgentService.get(DinoAPIURLConstants.CONTACT_VERSION)

    if (request.status === AgentStatus.OK) {
      try {
        const response = await request.get()!

        if (response.status === HttpStatus.OK) {
          const version: number = response.body

          return version
        }
      } catch {
        /**TO-DO Salvar log com o erro*/
      }
    }

    return undefined
  }

}


export default new ContactServerService()
