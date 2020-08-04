import LS_Constants from '../../../constants/LocalStorageKeysConstants'
import BaseLocalStorage from '../../../types/services/BaseLocalStorage'
import GlossaryItemModel from '../../../types/glossary/GlossaryItemModel'

class GlossaryLocalStorage extends BaseLocalStorage {
  getVersion = (): number => {
    let version = this.get(LS_Constants.GLOSSARY_VERSION)

    return version ? Number(version) : -1
  }

  getItems = (): Array<GlossaryItemModel> => {
    let items = this.get(LS_Constants.GLOSSARY_ITEMS)

    return items ? JSON.parse(items) : new Array<GlossaryItemModel>()
  }

  setVersion = (version: number) => {
    this.set(LS_Constants.GLOSSARY_VERSION, JSON.stringify(version))
  }

  setItems = (items: GlossaryItemModel[]) => {
    this.set(LS_Constants.GLOSSARY_ITEMS, JSON.stringify(items))
  }

  getShouldSync = (): boolean => {
    const should = this.get(LS_Constants.GLOSSARY_SHOULD_SYNC)

    if (should) {
      return JSON.parse(should)
    }

    return false
  }

  setShouldSync = (should: boolean) => {
    this.set(LS_Constants.GLOSSARY_SHOULD_SYNC, JSON.stringify(should))
  }
}

export default new GlossaryLocalStorage()
