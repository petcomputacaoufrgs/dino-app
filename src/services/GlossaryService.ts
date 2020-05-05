import HttpService from './DinoHttpService'
import DinoAPIURLConstants from '../constants/dino_api/DinoAPIURLConstants'
import GlossaryLocalStorageService from '../local_storage/GlossaryLocalStorage'
import GlossaryItemModel from '../model/dino_api/glossary/GlossaryItemModel'
import StringUtils from '../utils/StringUtils'

/**
 * @description
 */
class GlossaryService {

    getVersion = async (): Promise<number> => {

        const response = await HttpService.get(DinoAPIURLConstants.GLOSSARY_VERSION).catch((error) => {
            console.log("[getVersion()] API call error");
        })

        return response ? response.body : GlossaryLocalStorageService.getVersion()
    }

    getItems = async (): Promise<Array<GlossaryItemModel>> => {
        const response = await HttpService.get(DinoAPIURLConstants.GLOSSARY_LIST).catch((error) => {
            console.log("[getItems()] API call error");
        })

        return response ? response.body : GlossaryLocalStorageService.getItems()
    }

    checkUpdate = async () => {

        const newVersion = await this.getVersion()

        if (newVersion !== GlossaryLocalStorageService.getVersion()) {

            const newItens = await this.getItems()

            GlossaryLocalStorageService.setVersion(newVersion)
            GlossaryLocalStorageService.setItems(newItens.sort((a, b) =>
            StringUtils.normalizer(a.title) < StringUtils.normalizer(b.title) ? -1 : 1))     
        }
    }
}

export default new GlossaryService()

