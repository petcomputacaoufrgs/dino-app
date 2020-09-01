import Service from '../services/faq/FaqService'
import ServerService from '../services/faq/FaqServerService'
import BaseSync from './BaseSync'

class FaqSync implements BaseSync {

    receive = async (): Promise<void> => {

        const response = await ServerService.getUserFaqVersion()
        
        if(response !== undefined) {
            if (response.id === Service.getUserFaqId()) {
                if (response.version === Service.getVersion()) {
                    return
                }
            }
            await Service.getUserFaqFromServer()
        }
    }
}


export default new FaqSync()
