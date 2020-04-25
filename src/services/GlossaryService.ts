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

        return response ? response.body : GlossaryLocalStorageService.getGlossaryVersion()
    }

    getItems = async (): Promise<Array<GlossaryItemModel>> => {
        const response = await HttpService.get(DinoAPIURLConstants.PATH_GLOSSARY_LIST).catch((error) => {
            console.log("[getItems()] API call error");
        })

        //For future visitors: In the new HttpClient (Angular 4.3+), the response object is JSON by default, so you don't need to do response.json().data anymore. Just use response directly.
        return response ? response.body : GlossaryLocalStorageService.getGlossaryItems()
    }

    checkUpdate = async () => {

        const newVersion = await this.getVersion()

        if (newVersion !== GlossaryLocalStorageService.getGlossaryVersion()) {

            const newItens = await this.getItems()

            GlossaryLocalStorageService.setGlossaryVersion(newVersion)
            GlossaryLocalStorageService.setGlossaryItems(newItens.sort((a, b) =>
            StringUtils.normalize(a.title) < StringUtils.normalize(b.title) ? -1 : 1))     
        }
    }
}

export default new GlossaryService()

