import HttpService from './DinoHttpService'
import DinoAPIURLConstants from '../constants/DinoAPIURLConstants'
import LocalStorageService from './LocalStorageService'
import GlossaryModel from '../model/GlossaryModel';
import GlossaryItems from '../components/glossary/glossary_items/index';
import GlossaryItemModel from '../model/GlossaryItemModel';

/**
 * @description
 */
class GlossaryService {

    getVersion = async () => {

        const response = await HttpService.get(DinoAPIURLConstants.PATH_GLOSSARY_VERSION).catch((error)=>{
            console.log(error.message);
            alert("[getVersion()] API call error");
         })

         return response ? response.body.version : LocalStorageService.getGlossaryVersion()
    }

    getItems = async () : Promise<Array<GlossaryItemModel>> => {
        const response = await HttpService.get(DinoAPIURLConstants.PATH_GLOSSARY_LIST).catch((error)=>{
            console.log(error.message);
            alert("[getItems()] API call error");
         })

        //For future visitors: In the new HttpClient (Angular 4.3+), the response object is JSON by default, so you don't need to do response.json().data anymore. Just use response directly.
        return response ? response.body.itemList : LocalStorageService.getGlossaryItems()
    }

    checkUpdate = async () => {
       
        let newVersion = await this.getVersion()

        if (LocalStorageService.getGlossaryVersion() !== newVersion.toString()) { 
            
            let newItens = await this.getItems()

            /*
            let itensModelos = itens.map(item =>
                new GlossaryItemModel(item["id"], item["title"], item["text"], item["exists"]))
            this.glossaryModel = new GlossaryModel(newVersion, itensModelos)
            */

           let item = newItens[0]

            //sem o stringify não é possível acessar os dados
           LocalStorageService.setGlossaryVersion(JSON.stringify(newVersion))
           LocalStorageService.setGlossaryItems(JSON.stringify(newItens))
        }       
    }
}

export default new GlossaryService()

