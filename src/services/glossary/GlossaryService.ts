import GlossaryItemModel from '../../types/glossary/GlossaryItemModel'
import GlossaryLocalStorage from './local_storage/GlossaryLocalStorage'
import DinoAgentService from '../agent/dino/DinoAgentService'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import AgentStatus from '../../types/services/agent/AgentStatus'
import HttpStatus from 'http-status-codes'
import StringUtils from '../../utils/StringUtils'
import GlossaryContextUpdater from './GlossaryContextUpdater'

class GlossaryService {
  setItems = (items: GlossaryItemModel[]) => {
    GlossaryLocalStorage.setItems(items)
  }

  getItems = (): GlossaryItemModel[] => GlossaryLocalStorage.getItems()

  getVersion = (): number => GlossaryLocalStorage.getVersion()

  setVersion = (version: number) => {
    GlossaryLocalStorage.setVersion(version)
  }

  update = async (newVersion: number) => {
    if (newVersion !== this.getVersion()) {
      const newItens = await this.getAPIItems()

      if (newItens === undefined) {
        return
      }

      this.setVersion(newVersion)
      this.setItems(StringUtils.sortByAttr(newItens, 'title'))
      GlossaryContextUpdater.update()
    }
  }

  getAPIItems = async (): Promise<Array<GlossaryItemModel> | undefined> => {
    const request = await DinoAgentService.get(DinoAPIURLConstants.GLOSSARY_LIST)

    if (request.status === AgentStatus.OK) {
      try {
        const response = await request.get()!

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
    const request = await DinoAgentService.get(DinoAPIURLConstants.GLOSSARY_VERSION)

    if (request.status === AgentStatus.OK) {
      try {
        const response = await request.get()!

        if (response.status === HttpStatus.OK) {
          return response.body
        }
      } catch {
        /**TO-DO Log error */
      }
    }

    return undefined
  }

  removeUserData = () => {
    GlossaryLocalStorage.removeUserData()
  }
}

export default new GlossaryService()
