import HttpService from './DinoHttpService'
import DinoAPIURLConstants from '../constants/DinoAPIURLConstants'
import GlossaryLocalStorageService from './local_storage/GlossaryLocalStorageService'
import GlossaryItemModel from '../model/GlossaryItemModel'
import StringUtils from '../utils/StringUtils'

/**
 * @description
 */
class GlossaryService {

    getVersion = async (): Promise<number> => {

        const response = await HttpService.get(DinoAPIURLConstants.PATH_GLOSSARY_VERSION).catch((error) => {
            console.log("[getVersion()] API call error");
        })

        return response ? response.body : GlossaryLocalStorageService.getVersion()
    }

    getItems = async (): Promise<Array<GlossaryItemModel>> => {
        const response = await HttpService.get(DinoAPIURLConstants.PATH_GLOSSARY_LIST).catch((error) => {
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
            StringUtils.normalize(a.title) < StringUtils.normalize(b.title) ? -1 : 1))     
        }
    }
}

export default new GlossaryService()

