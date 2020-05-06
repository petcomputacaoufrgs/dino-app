import DinoAPIURLConstants from '../constants/dino_api/DinoAPIURLConstants'
import GlossaryLocalStorage from '../local_storage/GlossaryLocalStorage'
import GlossaryItemModel from '../model/dino_api/glossary/GlossaryItemModel'
import StringUtils from '../utils/StringUtils'
import DinoAgentService from './DinoAgentService';

class GlossaryService {

    getVersion = async (): Promise<number> => {

        const response = await DinoAgentService.get(DinoAPIURLConstants.GLOSSARY_VERSION).catch((error) => {
            console.log("[getVersion()] API call error");
        })

        return response ? response.body : GlossaryLocalStorage.getVersion()
    }

    getItems = async (): Promise<Array<GlossaryItemModel>> => {
        const response = await DinoAgentService.get(DinoAPIURLConstants.GLOSSARY_LIST).catch((error) => {
            console.log("[getItems()] API call error");
        })

        return response ? response.body : GlossaryLocalStorage.getItems()
    }

    checkUpdate = async () => {

        const newVersion = await this.getVersion()

        if (newVersion !== GlossaryLocalStorage.getVersion()) {

            const newItens = await this.getItems()

            GlossaryLocalStorage.setVersion(newVersion)
            GlossaryLocalStorage.setItems(newItens.sort((a, b) =>
            StringUtils.normalizer(a.title) < StringUtils.normalizer(b.title) ? -1 : 1))     
        }
    }
}

export default new GlossaryService()

