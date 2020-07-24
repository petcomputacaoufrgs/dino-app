import StringUtils from '../../utils/StringUtils'
import DinoAgentService from '../dino_agent/DinoAgentService'
import ContactModel from '../../types/contact/ContactModel'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import BaseUpdater from '../BaseUpdater'
import DinoAgentStatus from '../../types/dino_agent/DinoAgentStatus'
import HttpStatus from 'http-status-codes'

class ContactUpdater implements BaseUpdater {

  checkUpdates = () => {
    
  }


  getItems = async (): Promise<Array<ContactModel> | undefined> => {
    const request = DinoAgentService.get(DinoAPIURLConstants.GLOSSARY_LIST)

    if (request.status === DinoAgentStatus.OK) {
      try {
        const response = await request.get()

        if (response.status === HttpStatus.OK) {
          return response.body
        }
      } catch {
        /**TO-DO Log de erro */
      }
    }

    return undefined
  }
}

export default new ContactUpdater()
