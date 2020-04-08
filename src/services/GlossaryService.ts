import HttpService from './DinoHttpService'
import DinoAPIURLConstants from '../constants/DinoAPIURLConstants'
import HttpStatus from 'http-status-codes'
import GlossaryVersionModel from '../model/GlossaryVersionModel'
import LocalStorageService from './LocalStorageService'

/**
 * @description
 */
class GlossaryService {

    private VERSION = "version" 
    private ITEMS = "itemsList"

    getVersion = async () => {
        const response = await HttpService.get(DinoAPIURLConstants.PATH_GLOSSARY_VERSION).on('error', this.onError)
        if (response.status === HttpStatus.OK){
            alert('AEHOO')
            //const glossaryVersionModel = new GlossaryVersionModel(response.body.version)
            LocalStorageService.setGlossaryVersion(response.body.version.toString())
            //LocalStorageService.setGlossaryVersion(response.body[this.VERSION].toString())
        } 
        else alert('[Glossário] Erro na autenticação com a API do Dino')
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

