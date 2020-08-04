import ContactModel from '../../types/contact/ContactModel'
import ResponseSaveModel from '../../types/contact/ResponseSaveModel'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import HttpStatus from 'http-status-codes'
import DinoAgentService from '../../agent/DinoAgentService'
import AgentStatus from '../../types/agent/AgentStatus'


class ContactServerService {

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
