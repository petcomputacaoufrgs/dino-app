import StringUtils from '../../utils/StringUtils'
import DinoAgentService from '../dino_agent/DinoAgentService'
import GlossaryItemModel from './api_model/GlossaryItemModel'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import GlossaryService from './GlossaryService'
import BaseUpdater from '../BaseUpdater'
import DinoAgentStatus from '../dino_agent/model/DinoAgentStatus'
import HttpStatus from 'http-status-codes'

class GlossaryUpdater implements BaseUpdater {
  checkUpdates = async () => {
    const newVersion = await this.getVersion()

    if (newVersion === undefined) {
      GlossaryService.setShouldSync(true)
      return
    }

    if (newVersion !== GlossaryService.getVersion()) {
      const newItens = await this.getItems()

      if (newItens === undefined) {
        GlossaryService.setShouldSync(true)
        return
      }

      GlossaryService.setVersion(newVersion)
      GlossaryService.setItems(
        newItens.sort((a, b) =>
          StringUtils.normalize(a.title) < StringUtils.normalize(b.title)
            ? -1
            : 1
        )
      )
    }
  }

  getVersion = async (): Promise<number | undefined> => {
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

  getItems = async (): Promise<Array<GlossaryItemModel> | undefined> => {
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
}

export default new GlossaryUpdater()
