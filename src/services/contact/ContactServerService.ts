import DinoAgentService from '../dino_agent/DinoAgentService'
import ContactModel from '../../types/contact/ContactModel'
import ResponseSaveModel from '../../types/contact/ResponseSaveModel'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import DinoAgentStatus from '../../types/dino_agent/DinoAgentStatus'
import HttpStatus from 'http-status-codes'
import LS from './local_storage/index'
import LS_Constants from '../../constants/LocalStorageKeysConstants'

class ContactServerService {

  saveContacts = async (contactModels: Array<ContactModel>): Promise<ResponseSaveModel | undefined> => {

    const request = DinoAgentService.put(DinoAPIURLConstants.CONTACT_SAVE_ALL)

    if (request.status === DinoAgentStatus.OK) {
      console.log(request)
      try {
        const response = await request.get().send(contactModels)

        if (response.status === HttpStatus.OK) {
          return response.body as ResponseSaveModel
        }
      } catch {
        /**TO-DO Fazer log de erro */
        console.log("nop")
      }

      return undefined
    }
  }

  editContacts = async (contactModels: Array<ContactModel>): Promise<number | undefined> => {

    const request = DinoAgentService.put(DinoAPIURLConstants.CONTACT_EDIT_ALL)

    if (request.status === DinoAgentStatus.OK) {
      console.log("ok")
      try {
        const response = await request.get().send(contactModels)

        if (response.status === HttpStatus.OK) {
          return response.body
        }
      } catch {
        /**TO-DO Fazer log de erro */
        console.log("nop")
      }

      return undefined
    }
  }

  deleteContacts = async (contactIds: {id: number}[]): Promise<number | undefined> => {

    const request = DinoAgentService.put(DinoAPIURLConstants.CONTACT_EDIT_ALL)

    if (request.status === DinoAgentStatus.OK) {
      console.log("ok")
      try {
        const response = await request.get().send(contactIds)

        if (response.status === HttpStatus.OK) {
          return response.body
        }
      } catch {
        /**TO-DO Fazer log de erro */
        console.log("nop")
      }

      return undefined
    }
  }

  getVersion = async (): Promise<number | undefined> => {
    const request = DinoAgentService.get(DinoAPIURLConstants.CONTACT_CONTACT_VERSION)

    if (request.status === DinoAgentStatus.OK) {
      try {
        const response = await request.get()

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
  /*

  checkUpdates = async () => {
    
    if(LS.shouldSync()){
      console.log("checando")

      //const idsToSave = LS.getOpIDs(LS_Constants.ADD_CONTACTS)
      const contacts = LS.getItems()

      const contactsResponse = await this.saveContacts(contacts.filter(contact => contact.id === undefined))
      console.log(contactsResponse)

      if(contactsResponse !== undefined) {
        console.log("aqui foi")
        const updatedContacts = contacts.map(c => {
          if(c.id === undefined) {
            const updatedContactIndex = contactsResponse.findIndex(contactResponse => contactResponse.frontId === c.frontId)
            c.id = contactsResponse[updatedContactIndex].id
            contactsResponse.splice(updatedContactIndex, 1)
          }
          return c
        })
        if(contactsResponse.length === 0) {
          LS.cleanOpIDs(LS_Constants.CONTACTS_ADD)
        }
        console.log(updatedContacts)
        LS.setItems(updatedContacts)
      }
    }
  }
  */


  getItems = async (): Promise<Array<ContactModel> | undefined> => {
    const request = DinoAgentService.get(DinoAPIURLConstants.GLOSSARY_LIST)

    if (request.status === DinoAgentStatus.OK) {
      try {
        const response = await request.get()

        if (response.status === HttpStatus.OK) {
          const contactsToUpdate: Array<ContactModel> = response.body
          return contactsToUpdate
        }
      } catch {
        /**TO-DO Log de erro */
      }
    }

    return undefined
  }


}


export default new ContactServerService()
