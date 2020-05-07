import StringUtils from '../../utils/StringUtils'
import DinoAgentService from '../dino_agent/DinoAgentService'
import GlossaryItemModel from './api_model/GlossaryItemModel'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import GlossaryService from './GlossaryService'
import BaseUpdater from '../BaseUpdater'

class GlossaryUpdater implements BaseUpdater {
  checkUpdates = async () => {
    const newVersion = await this.getVersion()

    if (newVersion !== GlossaryService.getVersion()) {
      const newItens = await this.getItems()

      GlossaryService.setVersion(newVersion)
      GlossaryService.setItems(
        newItens.sort((a, b) =>
          StringUtils.normalizer(a.title) < StringUtils.normalizer(b.title)
            ? -1
            : 1,
        ),
      )
    }
  }

  getVersion = async (): Promise<number> => {
    const response = await DinoAgentService.get(
      DinoAPIURLConstants.GLOSSARY_VERSION,
    ).catch((error) => {
      console.log('[getVersion()] API call error')
    })

    return response ? response.body : GlossaryService.getVersion()
  }

  getItems = async (): Promise<Array<GlossaryItemModel>> => {
    const response = await DinoAgentService.get(
      DinoAPIURLConstants.GLOSSARY_LIST,
    ).catch((error) => {
      console.log('[getItems()] API call error')
    })

    return response ? response.body : GlossaryService.getItems()
  }
}

export default new GlossaryUpdater()
