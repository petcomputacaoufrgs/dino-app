import HttpService from './DinoHttpService'
import DinoAPIURLConstants from '../constants/DinoAPIURLConstants'
import HttpStatus from 'http-status-codes'
import LocalStorageService from './LocalStorageService'

/**
 * @description
 */
class GlossaryService {

    getVersion = async () => {

        const response = await HttpService.get(DinoAPIURLConstants.PATH_GLOSSARY_VERSION).on('error', this.onError)

        if (response.status === HttpStatus.OK) {
            return response.body.version
        }
        else alert('[Versão Glossário] Erro na autenticação com a API do Dino')
        return LocalStorageService.getGlossaryVersion()
    }

    getItems = async () => {

        const response = await HttpService.get(DinoAPIURLConstants.PATH_GLOSSARY_LIST).on('error', this.onError)
        //For future visitors: In the new HttpClient (Angular 4.3+), the response object is JSON by default, so you don't need to do response.json().data anymore. Just use response directly.
        if (response.status === HttpStatus.OK) {
            return response.body.itemList
        }
        else alert('[Itens Glossário] Erro na autenticação com a API do Dino')
        return LocalStorageService.getGlossaryItems()
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
           LocalStorageService.setGlossaryVersion(JSON.stringify(newVersion))
           LocalStorageService.setGlossaryItems(JSON.stringify(newItens))
        }       
    }

    /**
     * @description Trata erros nas requisições
     * @param erro Objeto contendo informações sobre o erro
     */
    private onError = (err: any) => {
    if (err.status === HttpStatus.FORBIDDEN) {
        alert('[Glossário] Erro na conexão com o servidor.')
    }
}
}

export default new GlossaryService()

