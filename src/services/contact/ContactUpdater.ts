import HttpStatus from 'http-status-codes'
import BaseUpdater from '../BaseUpdater'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import ContactModel from '../../types/contact/ContactModel'
import Service from './ContactService'
import ServerService from './ContactServerService'
import DinoAgentService from '../dino_agent/DinoAgentService'
import DinoAgentStatus from '../../types/dino_agent/DinoAgentStatus'


class ContactUpdater implements BaseUpdater {

  checkUpdates = async (): Promise<void> => {
    
    console.log("check updates")
    const serverVersion = await ServerService.getVersion()
    console.log(serverVersion)

    if (serverVersion !== undefined) {
      const localVersion = Service.getVersion()

      if (serverVersion !== localVersion) {
        await this.updateLocal(serverVersion)
      }

      return
    }
  }

  updateLocal = async (version: number): Promise<void> => {
    const request = DinoAgentService.get(DinoAPIURLConstants.CONTACT_GET)

    if (request.status === DinoAgentStatus.OK) {
      try {
        const response = await request.get()

        if (response.status === HttpStatus.OK) {
          const contacts: ContactModel[] = response.body

          Service.setVersion(version)

          Service.setItems(contacts)

          return
        }
      } catch {
        /**TO-DO Salvar log de erro */
      }
    }
    Service.setShouldSync(true)
  }

  updateServer = async () => {

    let idsToUpdate = Service.getIdsToUpdate()
    let sucessfulEdit = true
    let sucessfulAdd = true
    let sucessfulDel = true

        if(idsToUpdate.length > 0) {

          const contacts = Service.getItems()
          const contactsToUpdate = Service.getContactsToUpdate(contacts, idsToUpdate)

          if(contactsToUpdate.toAdd.length > 0) {
            
            const saveResponse = await ServerService.saveContacts(contactsToUpdate.toAdd)
            
            if(saveResponse !== undefined) {
              contactsToUpdate.toAdd = Service.updateContactIds(saveResponse.resposeModels, contacts)
              Service.setVersion(saveResponse.version)
              if(contactsToUpdate.toAdd.length > 0) {
                sucessfulAdd = false
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

        console.log(idsToDelete)

        if(idsToDelete.length > 0) {
          const version = await ServerService.deleteContacts(Service.getContactsToDelete())

          if (version !== undefined) {
            Service.setVersion(version)
            Service.cleanDeleteQueue()
          } else sucessfulDel = false
        }

      if(sucessfulAdd && sucessfulEdit && sucessfulDel)
        Service.setShouldSync(false)
  }

}

export default new ContactUpdater()
