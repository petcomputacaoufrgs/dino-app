import FaqItemModel from '../../types/faq/FaqItemModel'
import FaqLocalStorage from '../../local_storage/FaqLocalStorage'
import FaqContextUpdater from '../../context_updater/FaqContextUpdater'
import FaqModel from '../../types/faq/FaqModel'
import {FaqOptionsModel, FaqTitleOptionsModel} from '../../types/faq/FaqOptionsModel'
import ServerService from './FaqServerService'

class FaqService {

  updateLocal = async (version: number): Promise<void> => {
    
    this.getUserFaq()

  }

  switchUserFaq = async (faqOption: FaqTitleOptionsModel) => {
    if(faqOption.id > 0) {
      await this.saveUserFaqOnServer(faqOption)
      await this.getUserFaq()
    }
  }

  saveUserFaqOnServer = async (faqOption: FaqTitleOptionsModel) => {
    const savedId = await ServerService.saveUserFaqId(faqOption.id)

    if(savedId !== undefined) {
      //FaqLocalStorage.setUserFaqId(savedId)
      FaqLocalStorage.setUserFaqInfo(faqOption)
    }
  }

  getUserFaq = async () => {

    const response = await ServerService.getUserFaq() as FaqModel
    
    if(response !== undefined) {
      
      this.setUserFaqVersion(response.version)

      this.setItems(response.items)

      FaqContextUpdater.update()
      
    } else {
      console.log("não foi")
    }

  }

  getCurrentFaqInfo = () => {
    return FaqLocalStorage.getUserFaqInfo()

  }

  setItems = (items: FaqItemModel[]) => FaqLocalStorage.setItems(items)

  getItems = (): FaqItemModel[] => {
    
    const items = FaqLocalStorage.getItems()
    return items
  }
    
  getUserFaqVersion = (): number => FaqLocalStorage.getVersion()

  setUserFaqVersion = (version: number) => FaqLocalStorage.setVersion(version)

  getFaqOptions = async (): Promise<Array<FaqTitleOptionsModel>> => {

    const response = await ServerService.getFaqOptions() as FaqOptionsModel

    if(response !== undefined) {
      //this.setFaqOptionsVersion(response.version)
      return response.options
    }

    return [] as FaqTitleOptionsModel[]
  }

  //setFaqOptions = (options: Array<FaqTitleOptionsModel>) => FaqLocalStorage.setOptions(options)

  //getFaqOptionsVersion = (): number => FaqLocalStorage.getOptionsVersion()

  //setFaqOptionsVersion = (version: number) => FaqLocalStorage.setFaqOptionsVersion(version) 

  getUserFaqId = (): number => FaqLocalStorage.getUserFaqId()

  setUserFaqId = (id: number) => {
    ServerService.saveUserFaqId(id)
    FaqLocalStorage.setUserFaqId(id)
  }
  
  removeUserData = () => FaqLocalStorage.removeUserData()

}

export default new FaqService()
