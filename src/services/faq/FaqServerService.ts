import DinoAgentService from '../../agent/DinoAgentService'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import LogAppErrorService from '../log_app_error/LogAppErrorService'
import FaqModel from '../../types/faq/FaqModel'
import FaqOptionsModel from '../../types/faq/FaqOptionsModel'
import HttpStatus from 'http-status-codes'

class FaqServerService {


  getUserFaq = async (): Promise<FaqModel | undefined> => {
  
    const request = await DinoAgentService.get(DinoAPIURLConstants.FAQ_GET)
        
    if (request.canGo) {
      try {
        
        const response = await request.authenticate().go()

        if (response.status === HttpStatus.OK) {
          const faqModel = response.body as FaqModel

          return faqModel
        }
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }
    return undefined
  }

  saveUserFaqId = async (id: number): Promise<number | undefined> => {
    const request = await DinoAgentService.post(DinoAPIURLConstants.FAQ_SAVE)

    if (request.canGo) {
      try {
        const response = await request.authenticate().setBody({id}).go()

        if (response.status === HttpStatus.OK) {
          return response.body
        }
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }
    return undefined
  }
    
getFaqOptions = async (): Promise<Array<FaqOptionsModel> | undefined> => {
    const request = await DinoAgentService.get(DinoAPIURLConstants.FAQ_OPTIONS)
  
    if (request.canGo) {
      try {
        const response = await request.authenticate().go()
  
        console.log(response)
        if (response.status === HttpStatus.OK) {
          return response.body
        }
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }
  
    return undefined
  }
  
  
    getUserFaqVersion = async (): Promise<number | undefined> => {
      const request = await DinoAgentService.get(
        DinoAPIURLConstants.FAQ_GET
      )
  
      if (request.canGo) {
        try {
          const response = await request.authenticate().go()
  
          return response.body
        } catch (e) {
          LogAppErrorService.saveError(e)
        }
      }
  
      return undefined
    }

    getUserFaqsVersion = async (): Promise<number | undefined> => {
      const request = await DinoAgentService.get(
        DinoAPIURLConstants.FAQ_GET
      )
  
      if (request.canGo) {
        try {
          const response = await request.authenticate().go()
  
          return response.body
        } catch (e) {
          LogAppErrorService.saveError(e)
        }
      }
  
      return undefined
    }
  

}

export default new FaqServerService()