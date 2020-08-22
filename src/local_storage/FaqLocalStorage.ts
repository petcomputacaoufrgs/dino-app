import LS_Constants from '../constants/LocalStorageKeysConstants'
import BaseLocalStorage from './BaseLocalStorage'
import FaqItemModel from '../types/faq/FaqItemModel'
import { FaqTitleOptionsModel } from '../types/faq/FaqOptionsModel'

class FaqLocalStorage extends BaseLocalStorage {
  getItems = (): Array<FaqItemModel> => {
    let items = this.get(LS_Constants.FAQ_ITEMS)

    return items ? JSON.parse(items) : new Array<FaqItemModel>()
  }

  setItems = (items: FaqItemModel[]) => {
    this.set(LS_Constants.FAQ_ITEMS, JSON.stringify(items))
  }

  getOptions = (): Array<FaqTitleOptionsModel> => {
    const faqOptions = this.get(LS_Constants.FAQ_OPTIONS)

    return faqOptions ? JSON.parse(faqOptions) : new Array<FaqTitleOptionsModel>()
  }

  setOptions = (options: Array<FaqTitleOptionsModel>) => {
    this.set(LS_Constants.FAQ_OPTIONS, JSON.stringify(options))
  }

  getOptionsVersion = (): number => {
    const version = this.get(LS_Constants.FAQ_OPTIONS_VERSION)

    return version ? JSON.parse(version) : 0
  }

  setOptionsVersion = (version: number) => {
    this.set(LS_Constants.FAQ_OPTIONS_VERSION, JSON.stringify(version))
  }

  getVersion = (): number => {
    const version = this.get(LS_Constants.FAQ_USER_VERSION)
    
    return version ? JSON.parse(version) : 0
  }
  
  getUserFaqId = (): number => {
    const id = this.get(LS_Constants.FAQ_USER_ID)
    
    return id ? JSON.parse(id) : 0
  }
  
  setUserFaqId = (id: number) => {
    this.set(LS_Constants.FAQ_USER_ID, JSON.stringify(id))
  }

  getUserFaqVersion = (): number => {
    const version = this.get(LS_Constants.FAQ_USER_VERSION)
    
    return version ? JSON.parse(version) : 0
  }

  setUserFaqVersion = (version: number) => {
    this.set(LS_Constants.FAQ_USER_VERSION, JSON.stringify(version))
  }

  setFaqOptionsVersion = (version: number) => {
    this.set(LS_Constants.FAQ_OPTIONS_VERSION, JSON.stringify(version))
  }

  removeUserData = () => {
    this.remove(LS_Constants.FAQ_ITEMS)
    this.remove(LS_Constants.FAQ_OPTIONS)
    this.remove(LS_Constants.FAQ_OPTIONS_VERSION)
    this.remove(LS_Constants.FAQ_USER_ID)
    this.remove(LS_Constants.FAQ_USER_VERSION)
  }
}

export default new FaqLocalStorage()
