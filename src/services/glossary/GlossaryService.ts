import GlossaryItemModel from '../../types/glossary/GlossaryItemModel'
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

  shouldSync = (): boolean => {
    return GlossaryLocalStorage.getShouldSync()
  }

  setShouldSync = (should: boolean) => {
    GlossaryLocalStorage.setShouldSync(should)
  }
}

export default new GlossaryService()
