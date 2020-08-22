import FaqItemModel from '../../types/faq/FaqItemModel'
import FaqLocalStorage from '../../local_storage/FaqLocalStorage'
import FaqContextUpdater from '../../context_updater/FaqContextUpdater'
import FaqModel from '../../types/faq/FaqModel'
import {FaqOptionsModel, FaqTitleOptionsModel} from '../../types/faq/FaqOptionsModel'
import ServerService from './FaqServerService'

class FaqService {

  updateLocal = async (version: number): Promise<void> => {
    
    const userFaq = await ServerService.getUserFaq()
  
    if(userFaq) {
      
          this.setUserVersion(version)
    
          this.setItems(userFaq.items)
  
          FaqContextUpdater.update()
  
          return
      }
  }

  saveUserFaqId = async (id: number) => {
    const savedId = await ServerService.saveUserFaqId(Number(id))
    console.log("salvando")

    if(savedId !== undefined) 
      FaqLocalStorage.setUserFaqId(savedId)

  }

  getUserFaq = async () => {

    const response = await ServerService.getUserFaq() as FaqModel

    
    
    if(response !== undefined) {
      console.log("pegando", response)
      
      this.setUserVersion(response.version)

      this.setItems(response.items)

      FaqContextUpdater.update()
      
      //return response.items
    }
    //return [] as FaqItemModel[]

  }

  changeUserFaq = async (id: number): Promise<FaqItemModel[]> => {

    const response = await ServerService.getUserFaq() as FaqModel

    if(response !== undefined) {
      
      this.setUserVersion(response.version)
      
      return response.items
    }
    return [] as FaqItemModel[]

  }

  setItems = (items: FaqItemModel[]) => FaqLocalStorage.setItems(items)

  getItems = (): FaqItemModel[] => FaqLocalStorage.getItems()

  getUserVersion = (): number => FaqLocalStorage.getVersion()

  setUserVersion = (version: number) => FaqLocalStorage.setUserFaqVersion(version)

  getFaqOptions = async (): Promise<Array<FaqTitleOptionsModel>> => {

    const response = await ServerService.getFaqOptions() as FaqOptionsModel

    if(response !== undefined) {
      this.setFaqOptionsVersion(response.version)
      return response.options
    }

    return [] as FaqTitleOptionsModel[]
  }

  setFaqOptions = (options: Array<FaqTitleOptionsModel>) => FaqLocalStorage.setOptions(options)

  getFaqOptionsVersion = (): number => FaqLocalStorage.getOptionsVersion()

  setFaqOptionsVersion = (version: number) => FaqLocalStorage.setFaqOptionsVersion(version) 

  getUserFaqId = (): number => FaqLocalStorage.getUserFaqId()

  setUserFaqId = (id: number) => {
    ServerService.saveUserFaqId(id)
    FaqLocalStorage.setUserFaqId(id)
  }

  getUserFaqVersion = (): number => FaqLocalStorage.getUserFaqVersion()

  setUserFaqVersion = (version: number) => FaqLocalStorage.setUserFaqVersion(version)
  
  removeUserData = () => FaqLocalStorage.removeUserData()

}

export default new FaqService()
