import GlossaryItemModel from './api_model/GlossaryItemModel'
import GlossaryLocalStorage from './local_storage/GlossaryLocalStorage'

class GlossaryService {
  setItems = (items: GlossaryItemModel[]) => {
    GlossaryLocalStorage.setItems(items)
  }

  getItems = (): GlossaryItemModel[] => GlossaryLocalStorage.getItems()

  getVersion = (): number => GlossaryLocalStorage.getVersion()

  setVersion = (version: number) => {
    GlossaryLocalStorage.setVersion(version)
  }
}

export default new GlossaryService()
