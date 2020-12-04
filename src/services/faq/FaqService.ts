import FaqItemModel from '../../types/faq/FaqItemModel'
import LS from '../../storage/local_storage/faq/FaqLocalStorage'
import FaqModel from '../../types/faq/FaqModel'
import FaqOptionsModel from '../../types/faq/FaqOptionsModel'
import ServerService from './FaqServerService'
import CurrentFaqContextUpdater from '../../context/updater/CurrentFaqContextUpdater'
import strUtils from '../../utils/StringUtils'
class FaqService {
  getUserFaqFromServer = async () => {
    const response = await ServerService.getUserFaq()
    if (response !== undefined) {
      this.setFaq(response)
    }
  }

  switchUserFaq = async (faqOption: FaqOptionsModel) => {
    if(this.getUserFaqId() != faqOption.id) {
      await ServerService.saveUserFaqId(faqOption.id)
      await this.getUserFaqFromServer()
    }
  }

  saveUserQuestion = async (selectedFaq: FaqOptionsModel, question: string) => {
    await ServerService.saveUserQuestion(selectedFaq.id, question)
  }

  getTreatmentEssentialContactsFromServer = async(selectedFaq: FaqOptionsModel) => {
    await ServerService.getTreatmentEssentialContacts(selectedFaq.id)
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

  getFaqOptionsFromServer = async (): Promise<
    Array<FaqOptionsModel> | undefined
  > => {
    return await ServerService.getFaqOptions()
  }

  removeUserData = () => LS.removeUserData()
}

export default new FaqService()
