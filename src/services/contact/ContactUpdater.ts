import HttpStatus from 'http-status-codes'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import ContactModel from '../../types/contact/ContactModel'
import Service from './ContactService'
import ServerService from './ContactServerService'
import BaseUpdater from '../../types/services/BaseUpdater'
import AgentStatus from '../../types/services/agent/AgentStatus'
import DinoAgentService from '../agent/dino/DinoAgentService'


class ContactUpdater implements BaseUpdater {

  checkUpdates = async (): Promise<void> => { //server -> local
    
    const serverVersion = await ServerService.getVersion()

    if (serverVersion !== undefined) {
      const localVersion = Service.getVersion()

      if (serverVersion !== localVersion) {
        await this.updateLocal(serverVersion)
      }
      return
    }
  }

  updateLocal = async (version: number): Promise<void> => {
    const request = await DinoAgentService.get(DinoAPIURLConstants.CONTACT_GET)

    if (request.status === AgentStatus.OK) {

      try {
        const response = await request.get()!

        if (response.status === HttpStatus.OK) {
          const newContacts: ContactModel[] = response.body

          Service.setVersion(version)

          Service.setItems(Service.getItems()
          .filter(c => c.id === undefined)
          .concat(newContacts.map(c => {
            c.frontId = Service.makeFrontId() 
            return c
          })))

          return
        }
      } catch {
        /**TO-DO Salvar log de erro */
      }
    }
  }

  updateServer = async () => {

    let sucessfulAdd = true
    let sucessfulEdit = true
    let idsToUpdate = Service.getIdsToUpdate()

        if(idsToUpdate.length > 0) {

          const contacts = Service.getItems()
          const contactsToUpdate = Service.getContactsToUpdate(contacts, idsToUpdate)

          if(contactsToUpdate.toAdd.length > 0) {
            
            const responseSaveModel = await ServerService.saveContacts(contactsToUpdate.toAdd)
            
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
            
            const version = await ServerService.editContacts(contactsToUpdate.toEdit)
            
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

          const version = await ServerService.deleteContacts(idsToDelete)

          if (version !== undefined) {
            Service.setVersion(version)
            Service.cleanDeleteQueue()
          }
        }
  }

}

export default new ContactUpdater()
