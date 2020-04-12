import HttpService from './DinoHttpService'
import DinoAPIURLConstants from '../constants/DinoAPIURLConstants'
import HttpStatus from 'http-status-codes'
import LocalStorageService from './LocalStorageService'

/**
 * @description
 */
class GlossaryService {

    getVersion = async () => {

        const response = await HttpService.get(DinoAPIURLConstants.PATH_GLOSSARY_VERSION).catch((error)=>{
            console.log("[getVersion()] Api call error");
            alert(error.message);
         })

         return response ? response.body.version : LocalStorageService.getGlossaryVersion()
    }

    getItems = async () => {

        const response = await HttpService.get(DinoAPIURLConstants.PATH_GLOSSARY_LIST).catch((error)=>{
            console.log("[getItems()] Api call error");
            alert(error.message);
         })
         
        //For future visitors: In the new HttpClient (Angular 4.3+), the response object is JSON by default, so you don't need to do response.json().data anymore. Just use response directly.
         return response ? response.body.itemList : LocalStorageService.getGlossaryItems()

    }

    checkUpdate = async () => {
       
        let newVersion = await this.getVersion()

        if (LocalStorageService.getGlossaryVersion() !== newVersion) {

            let newItens = await this.getItems()
            /*
            let itensModelos = itens.map(item =>
                new GlossaryItemModel(item["id"], item["title"], item["text"], item["exists"]))
            this.glossaryModel = new GlossaryModel(newVersion, itensModelos)
            */

            //sem o stringify não é possível acessar os dados
           LocalStorageService.setGlossaryVersion(JSON.stringify(newVersion))
           LocalStorageService.setGlossaryItems(JSON.stringify(newItens))
        }       
    }
}

export default new GlossaryService()

