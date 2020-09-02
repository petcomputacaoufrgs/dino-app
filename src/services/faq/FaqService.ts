import FaqItemModel from '../../types/faq/FaqItemModel'
import LS from '../../local_storage/FaqLocalStorage'
import FaqModel from '../../types/faq/FaqModel'
import FaqOptionsModel from '../../types/faq/FaqOptionsModel'
import ServerService from './FaqServerService'
import CurrentFaqContextUpdater from '../../context_updater/CurrentFaqContextUpdater'
import strUtils from '../../utils/StringUtils'
class FaqService {
  getUserFaqFromServer = async () => {
    const response = await ServerService.getUserFaq()
    if (response !== undefined) {
      this.setFaq(response)
    }
  }

  switchUserFaq = async (faqOption: FaqOptionsModel) => {
    await ServerService.saveUserFaqId(faqOption.id)
    await this.getUserFaqFromServer()
  }

  saveUserQuestion = async (selectedFaq: FaqOptionsModel, question: string) => {
    await ServerService.saveUserQuestion(selectedFaq.id, question)
  }

  setFaq = (faq: FaqModel) => {
    LS.setVersion(faq.version)

    LS.setUserFaq({
      id: faq.id,
      title: faq.title,
    } as FaqOptionsModel)

    this.setItems(faq.items)
    
    CurrentFaqContextUpdater.update()
  }

  setItems = (items: FaqItemModel[]) => {
    LS.setItems(strUtils.sortByAttr(items, 'question'))
  }

  getItems = (): FaqItemModel[] => {
    return LS.getItems()
  }

  getUserFaqInfo = (): FaqOptionsModel | undefined => {
    return LS.getUserFaq()
  }

  getUserFaqId = (): number | undefined => {
    const info = this.getUserFaqInfo()
    return info ? info.id : undefined
  }

  getVersion = () => {
    return LS.getVersion()
  }

  getFaqOptionsFromServer = async (): Promise<Array<FaqOptionsModel> | undefined> => {
    return await ServerService.getFaqOptions()
  }

  removeUserData = () => LS.removeUserData()
}

export default new FaqService()
