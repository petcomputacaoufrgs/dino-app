import HttpService from './DinoHttpService'
import DinoAPIURLConstants from '../constants/DinoAPIURLConstants'
import LocalStorageService from './LocalStorageService'
import GlossaryItemModel from '../model/GlossaryItemModel'
import StringUtils from '../utils/StringUtils'

/**
 * @description
 */
class GlossaryService {

    getVersion = async (): Promise<number> => {

        const response = await HttpService.get(DinoAPIURLConstants.PATH_GLOSSARY_VERSION).catch((error) => {
            console.log(error.message);
            alert("[getVersion()] API call error");
        })

        return response ? response.body : LocalStorageService.getGlossaryVersion()
    }

    getItems = async (): Promise<Array<GlossaryItemModel>> => {
        const response = await HttpService.get(DinoAPIURLConstants.PATH_GLOSSARY_LIST).catch((error) => {
            console.log(error.message);
            alert("[getItems()] API call error");
        })

        //For future visitors: In the new HttpClient (Angular 4.3+), the response object is JSON by default, so you don't need to do response.json().data anymore. Just use response directly.
        return response ? response.body : LocalStorageService.getGlossaryItems()
    }

    checkUpdate = async () => {

        let newVersion = await this.getVersion()

        if (newVersion !== LocalStorageService.getGlossaryVersion()) {

            let newItens = await this.getItems()

            LocalStorageService.setGlossaryVersion(newVersion)
            LocalStorageService.setGlossaryItems(newItens.sort((a, b) =>
            StringUtils.normalizeString(a.title) < StringUtils.normalizeString(b.title) ? -1 : 1))     
        }
    }
}

export default new GlossaryService()

