import ContactModel from '../../types/contact/ContactModel'
import ResponseSaveModel from '../../types/contact/ResponseSaveModel'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import HttpStatus from 'http-status-codes'
import DinoAgentService from '../../agent/DinoAgentService'
import LogAppErrorService from '../log_app_error/LogAppErrorService'

class ContactServerService {

  saveContacts = async (contactModels: Array<ContactModel>): Promise<ResponseSaveModel | undefined> => {
    const request = await DinoAgentService.post(DinoAPIURLConstants.CONTACT_SAVE_ALL)

    if (request.canGo) {
      try {
        const response = await request.authenticate().setBody(contactModels).go()

        const responseSaveModel = response.body as ResponseSaveModel

        return responseSaveModel
      } catch(e) {
        LogAppErrorService.saveError(e)
      }

      return undefined
    }
  }

  editContacts = async (contactModels: Array<ContactModel>): Promise<number | undefined> => {

    const request = await DinoAgentService.put(DinoAPIURLConstants.CONTACT_EDIT_ALL)

    if (request.canGo) {
      try {
        const response = await request.authenticate().setBody(contactModels).go()

        return response.body
      } catch(e) {
        LogAppErrorService.saveError(e)
      }

      return undefined
    }
  }

  deleteContacts = async (contactIds: {id: number}[]): Promise<number | undefined> => {

    const request = await DinoAgentService.delete(DinoAPIURLConstants.CONTACT_EDIT_ALL)

    if (request.canGo) {
      try {
        const response = await request.authenticate().setBody(contactIds).go()

        return response.body
      } catch(e) {
        LogAppErrorService.saveError(e)
      }

      return undefined
    }
  }

  getVersion = async (): Promise<number | undefined> => {
    const request = await DinoAgentService.get(DinoAPIURLConstants.CONTACT_VERSION)

    if (request.canGo) {
      try {
        const response = await request.authenticate().go()

        const version: number = response.body

        return version
      } catch(e) {
        LogAppErrorService.saveError(e)
      }
    }

    return undefined
  }

}


export default new ContactServerService()
