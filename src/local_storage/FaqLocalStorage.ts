import LS_Constants from '../constants/LocalStorageKeysConstants'
import BaseLocalStorage from './BaseLocalStorage'
import FaqItemModel from '../types/faq/FaqItemModel'
import FaqOptionsModel from '../types/faq/FaqOptionsModel'

class FaqLocalStorage extends BaseLocalStorage {
  getItems = (): Array<FaqItemModel> => {
    let items = this.get(LS_Constants.FAQ_ITEMS)

    return items ? JSON.parse(items) : new Array<FaqItemModel>()
  }

  setItems = (items: FaqItemModel[]) => {
    this.set(LS_Constants.FAQ_ITEMS, JSON.stringify(items))
  }

  getUserFaq = (): FaqOptionsModel | undefined => {
    const faq = this.get(LS_Constants.FAQ_USER_INFO)
    
    return faq ? JSON.parse(faq) : undefined
  }
  
  setUserFaq = (faq: FaqOptionsModel) => {
    this.set(LS_Constants.FAQ_USER_INFO, JSON.stringify(faq))
  }

  getVersion = (): number => {
    const version = this.get(LS_Constants.FAQ_USER_VERSION)
    
    return version ? JSON.parse(version) : 0
  }

  setVersion = (version: number) => {
    this.set(LS_Constants.FAQ_USER_VERSION, JSON.stringify(version))
  }

  getShouldSync = (): boolean => {
    const shouldSync = this.get(LS_Constants.FAQ_SHOULD_SYNC)
    
    return shouldSync ? JSON.parse(shouldSync) : false
  }
  
  setShouldSync = (shouldSync: boolean) => {
    this.set(LS_Constants.FAQ_SHOULD_SYNC, JSON.stringify(shouldSync))
  }

  removeUserData = () => {
    this.remove(LS_Constants.FAQ_ITEMS)
    this.remove(LS_Constants.FAQ_USER_VERSION)
    this.remove(LS_Constants.FAQ_USER_INFO)
    this.remove(LS_Constants.FAQ_SHOULD_SYNC)
  }
}

export default new FaqLocalStorage()
