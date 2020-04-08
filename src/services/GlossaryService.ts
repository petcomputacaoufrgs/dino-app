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
        const response = await HttpService.get(DinoAPIURLConstants.PATH_GLOSSARY_VERSION)
        if (response.status === HttpStatus.OK){
            alert('AEHOO')
            //const glossaryVersionModel = new GlossaryVersionModel(response.body.version)
            LocalStorageService.setGlossaryVersion(response.body["version"].toString())
        } 
        else alert('Erro na autenticação com a API do Dino')
        return
    }
}

export default new GlossaryService()

