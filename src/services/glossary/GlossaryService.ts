import GlossaryItemModel from '../../types/glossary/GlossaryItemModel'
import GlossaryLocalStorage from './local_storage/GlossaryLocalStorage'
import DinoAgentService from '../dino_agent/DinoAgentService'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import DinoAgentStatus from '../../types/dino_agent/DinoAgentStatus'
import HttpStatus from 'http-status-codes'
import StringUtils from '../../utils/StringUtils'

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

  update = async (newVersion: number) => {
    if (newVersion !== this.getVersion()) {
      const newItens = await this.getAPIItems()

      if (newItens === undefined) {
        this.setShouldSync(true)
        return
      }

      this.setVersion(newVersion)
      this.setItems(StringUtils.sortByAttr(newItens, 'title'))
    }
  }

  getAPIItems = async (): Promise<Array<GlossaryItemModel> | undefined> => {
    const request = DinoAgentService.get(DinoAPIURLConstants.GLOSSARY_LIST)

    if (request.status === DinoAgentStatus.OK) {
      try {
        const response = await request.get()

        if (response.status === HttpStatus.OK) {
          return response.body
        }
      } catch {
        /**TO-DO Log de erro */
      }
    }

    return undefined
  }

  getAPIVersion = async (): Promise<number | undefined> => {
    const request = DinoAgentService.get(DinoAPIURLConstants.GLOSSARY_VERSION)

    if (request.status === DinoAgentStatus.OK) {
      try {
        const response = await request.get()

        if (response.status === HttpStatus.OK) {
          return response.body
        }
      } catch {
        /**TO-DO Log error */
      }
    }

    return undefined
  }
}

export default new GlossaryService()
