import HttpStatus from 'http-status-codes'
import BaseUpdater from '../BaseUpdater'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import ContactModel from '../../types/contact/ContactModel'
import Service from './ContactService'
import ServerService from './ContactServerService'
import DinoAgentService from '../dino_agent/DinoAgentService'
import DinoAgentStatus from '../../types/dino_agent/DinoAgentStatus'
//import ContactSyncLocalStorage from './local_storage/ContactSyncLocalStorage'
import LS from './local_storage/index'
import LS_Constants from '../../constants/LocalStorageKeysConstants'


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
    const idsToUpdate = LS.getOpIDs(LS_Constants.CONTACTS_UPDATE)

        if(idsToUpdate.length > 0) {
          const contacts = LS.getItems()
          const contactsToUpdate = Service.getContactsToUpdate(contacts, idsToUpdate)
          if(contactsToUpdate.toAdd.length > 0) {
            const response = await ServerService.saveContacts(contactsToUpdate.toAdd)
            if(response) {
              Service.updateContactIds(response.resposeModels, contacts)
              Service.setVersion(response.version)
            }
          }
          if(contactsToUpdate.toEdit.length > 0) {
            await ServerService.editContacts(contactsToUpdate.toEdit)
          } 
        }

        const idsToDelete = Service.getContactsToDelete()

        if(idsToDelete.length > 0) {
          await ServerService.deleteContacts(idsToDelete)
        }
  }

}

export default new ContactUpdater()
