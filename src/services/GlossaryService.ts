import HttpService from './DinoHttpService'
import DinoAPIURLConstants from '../constants/DinoAPIURLConstants'
import HttpStatus from 'http-status-codes'
import GlossaryVersionModel from '../model/GlossaryVersionModel'
import LocalStorageService from './LocalStorageService'

/**
 * @description
 */
class GlossaryService {

    getVersion = async () => {
        const response = await HttpService.get(DinoAPIURLConstants.PATH_GLOSSARY_VERSION).on('error', this.onError)
        if (response.status === HttpStatus.OK){
            alert('AEHOO')
            //const glossaryVersionModel = new GlossaryVersionModel(response.body.version)
            LocalStorageService.setGlossaryVersion(response.body.version.toString())
        } 
        else alert('[Versão Glossário] Erro na autenticação com a API do Dino')
        return
    }

    getItems = async () => {
        const response = await HttpService.get(DinoAPIURLConstants.PATH_GLOSSARY_LIST).on('error', this.onError)
        if (response.status === HttpStatus.OK){
            alert('OOHEA')
            //const glossaryVersionModel = new GlossaryVersionModel(response.body.version)
            //LocalStorageService.setGlossaryVersion(response.body.itemsList.toString())
            console.log(response.body.itemsList)
        } 
        else alert('[Itens Glossário] Erro na autenticação com a API do Dino')
        return
    }
    
    /**
     * @description Trata erros nas requisições
     * @param erro Objeto contendo informações sobre o erro
     */
    private onError = (err: any) => {
        if (err.status === HttpStatus.FORBIDDEN) {

            /** Limpa o token de autenticação */
            LocalStorageService.setGlossaryVersion('')

            /** Redireciona para o login */
            //HistoryService.push(PathConstants.LOGIN)

            alert('[Glossário] Erro na conexão com o servidor.')
        }
    }
}

export default new GlossaryService()

