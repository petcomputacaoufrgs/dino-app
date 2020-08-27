import FaqItemModel from '../../types/faq/FaqItemModel'
import LS from '../../local_storage/FaqLocalStorage'
import FaqContextUpdater from '../../context_updater/FaqContextUpdater'
import FaqModel from '../../types/faq/FaqModel'
import FaqOptionsModel from '../../types/faq/FaqOptionsModel'
import ServerService from './FaqServerService'

class FaqService {
  
  getUserFaqFromServer = async () => {
    const response = await ServerService.getUserFaq()
    if(response !== undefined) {
      this.setFaq(response)
    }
  }
  
  switchUserFaq = async (faqOption: FaqOptionsModel) => {
    await ServerService.saveUserFaqId(faqOption.id)
    await this.getUserFaqFromServer()
  }

  setFaq = (faq: FaqModel) => {
    LS.setVersion(faq.version)

    LS.setUserFaq({
      id: faq.id,
      title: faq.title
    } as FaqOptionsModel)

    this.setItems(faq.items)
  }

  setItems = (items: FaqItemModel[]) => {
    LS.setItems(items)
    FaqContextUpdater.update()
  }

  getItems = (): FaqItemModel[] => {
    return LS.getItems()
  }
  
  getUserFaqInfo = () => {
    return LS.getUserFaq()
  }

  getUserFaqId = () => {
    const info = this.getUserFaqInfo()
    return info ? info.id : undefined
  }

  getVersion = () => {
    return LS.getVersion()
  }

  getFaqOptionsFromServer = async (): Promise<Array<FaqOptionsModel>> => {
    return await ServerService.getFaqOptions() as FaqOptionsModel[]
  }
  
  removeUserData = () => LS.removeUserData()

}

export default new FaqService()
