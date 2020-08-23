import Service from '../services/faq/FaqService'
import ServerService from '../services/faq/FaqServerService'
import BaseSync from './BaseSync'
import FaqModel from '../types/faq/FaqModel'

class FaqSync implements BaseSync {
  
  send = async (): Promise<void> => {
      /*
    if(Service.shouldSync()) {
      await ServerService.updateServer()
    }
    */
   console.log("legal")
  }
  
    receive = async (): Promise<void> => {

        const response = await ServerService.getUserFaq() as FaqModel
        
        if(response !== undefined) {
            if (response.id !== Service.getUserFaqInfo()?.id) {
                Service.setFaq(response)
            } else {
                if (response.version !== Service.getVersion()) {
                    Service.setFaq(response)
                }
            }
        }
    }
}


export default new FaqSync()
