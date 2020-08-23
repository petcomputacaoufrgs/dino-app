import FaqItemModel from '../../types/faq/FaqItemModel'
import FaqLocalStorage from '../../local_storage/FaqLocalStorage'
import FaqContextUpdater from '../../context_updater/FaqContextUpdater'
import FaqModel from '../../types/faq/FaqModel'
import FaqOptionsModel from '../../types/faq/FaqOptionsModel'
import ServerService from './FaqServerService'

class FaqService {

  updateLocal = async (version: number): Promise<void> => {
    
    this.getUserFaq()

  }

  switchUserFaq = async (faqOption: FaqOptionsModel) => {
    if(faqOption.id > 0) {
      await this.saveUserFaqOnServer(faqOption)
      await this.getUserFaq()
    }
  }

  saveUserFaqOnServer = async (faqOption: FaqOptionsModel) => {
    const savedId = await ServerService.saveUserFaqId(faqOption.id)

    if(savedId !== undefined) {
      FaqLocalStorage.setUserFaq(faqOption)
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
    return FaqLocalStorage.getUserFaq()
  }

  setItems = (items: FaqItemModel[]) => FaqLocalStorage.setItems(items)

  getItems = (): FaqItemModel[] => {
    
    const items = FaqLocalStorage.getItems()
    return items
  }
    
  getUserFaqVersion = (): number => FaqLocalStorage.getVersion()

  setUserFaqVersion = (version: number) => FaqLocalStorage.setVersion(version)

  getFaqOptions = async (): Promise<Array<FaqOptionsModel>> => {

    return await ServerService.getFaqOptions() as FaqOptionsModel[]

  }
  
  removeUserData = () => FaqLocalStorage.removeUserData()

}

export default new FaqService()
