import GlossaryItemModel from '../../types/glossary/GlossaryItemModel'
import GlossaryLocalStorage from '../../local_storage/GlossaryLocalStorage'
import DinoAgentService from '../../agent/DinoAgentService'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import StringUtils from '../../utils/StringUtils'
import GlossaryContextUpdater from '../../context_updater/GlossaryContextUpdater'
import LogAppErrorService from '../log_app_error/LogAppErrorService'

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

      if (newItens === undefined) return

      this.setVersion(newVersion)
      this.setItems(StringUtils.sortByAttr(newItens, 'title'))
      GlossaryContextUpdater.update()
    }
  }

  getAPIItems = async (): Promise<Array<GlossaryItemModel> | undefined> => {
    const request = await DinoAgentService.get(
      DinoAPIURLConstants.GLOSSARY
    )

    if (request.canGo) {
      try {
        const response = await request.go()

        return response.body
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }

    return undefined
  }

  getAPIVersion = async (): Promise<number | undefined> => {
    const request = await DinoAgentService.get(
      DinoAPIURLConstants.GLOSSARY_VERSION
    )

    if (request.canGo) {
      try {
        const response = await request.go()

        return response.body
      } catch (e) {
        LogAppErrorService.saveError(e)
      }
    }

    return undefined
  }

  removeUserData = () => {
    GlossaryLocalStorage.removeUserData()
  }
}

export default new GlossaryService()
