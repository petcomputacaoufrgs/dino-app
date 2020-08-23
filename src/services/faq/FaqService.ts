import FaqItemModel from '../../types/faq/FaqItemModel'
import FaqLocalStorage from '../../local_storage/FaqLocalStorage'
import FaqContextUpdater from '../../context_updater/FaqContextUpdater'
import FaqModel from '../../types/faq/FaqModel'
import FaqOptionsModel from '../../types/faq/FaqOptionsModel'
import ServerService from './FaqServerService'

class FaqService {

  updateFaq = async (newVersion: number): Promise<void> => {
    if(FaqLocalStorage.getVersion() !== newVersion) {
      await this.getUserFaqFromServer()
    }
  }

  updateUserFaq = async (newFaq: number): Promise<void> => {
    if(FaqLocalStorage.getUserFaq()?.id !== newFaq) {
      await this.getUserFaqFromServer()
    }
  }

  switchUserFaq = async (faqOption: FaqOptionsModel) => {
    await this.saveUserFaqOnServer(faqOption)
    await this.getUserFaqFromServer()
    this.setShouldSync(true)
  }

  saveUserFaqOnServer = async (faqOption: FaqOptionsModel) => {

    const response = await ServerService.saveUserFaqId(faqOption.id)

    if(response !== undefined) {
      FaqLocalStorage.removeUserData()
      FaqLocalStorage.setUserFaq(faqOption)
    }
  }

  getUserFaqFromServer = async () => {

    const response = await ServerService.getUserFaq() as FaqModel
    
    if(response !== undefined) {
      
      this.setFaq(response)

    } else {
      console.log("não foi")
    }
  }

  setFaq = (faq: FaqModel) => {
    FaqLocalStorage.setVersion(faq.version)

    FaqLocalStorage.setUserFaq({
      id: faq.id,
      title: faq.title
    } as FaqOptionsModel)

    this.setItems(faq.items)
  }

  setItems = (items: FaqItemModel[]) => {
    FaqLocalStorage.setItems(items)
    FaqContextUpdater.update()
  }

  getItems = (): FaqItemModel[] => {
    const items = FaqLocalStorage.getItems()
    return items
  }
  
  getUserFaqInfo = () => {
    return FaqLocalStorage.getUserFaq()
  }

  getVersion = () => {
    return FaqLocalStorage.getVersion()
  }

  getFaqOptionsFromServer = async (): Promise<Array<FaqOptionsModel>> => {
    return await ServerService.getFaqOptions() as FaqOptionsModel[]
  }
  
  removeUserData = () => FaqLocalStorage.removeUserData()

  shouldSync = () => FaqLocalStorage.getShouldSync()

  setShouldSync = (shouldSync: boolean) => FaqLocalStorage.setShouldSync(shouldSync)

}

export default new FaqService()
