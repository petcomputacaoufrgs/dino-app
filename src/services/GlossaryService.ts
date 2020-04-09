import HttpService from './DinoHttpService'
import DinoAPIURLConstants from '../constants/DinoAPIURLConstants'
import HttpStatus from 'http-status-codes'
import LocalStorageService from './LocalStorageService'
import GlossaryModel from '../model/GlossaryModel'
import GlossaryItemModel from '../model/GlossaryItemModel'

/**
 * @description
 */
class GlossaryService {

    public glossary = '{"version": 5,' +
    '"itemList": [{"id": 1, "title":"Adenomegalia", "text":"Linfonodos ou gânglios aumentados, também conhecidos como ínguas.", "long_text": "isso é um texto longo", "exists": true },'+
    '{"id": 2, "title":"Anemia", "text":"Redução das células vermelhas do sangue.", "long_text": "isso é um texto longo", "exists": true },'+
    '{"id": 3, "title":"Anestesia", "text":"", "long_text": "isso é um texto longo", "exists": true },'+
    '{"id": 4, "title":"Antibiótico", "text":"Medicação contra bactérias.", "long_text": "isso é um texto longo", "exists": true },'+
    '{"id": 5, "title":"Biópsia", "text":"Retirada de pequeno pedaço do tumor ou órgão que é analisada em labo-ratório.", "long_text": "isso é um texto longo", "exists": true },'+
    '{"id": 6, "title":"Benigno", "text":"", "long_text": "isso é um texto longo", "exists": true }]}'    
    /*'{"id": 7, "title":"Anemia", "text":"Redução das células vermelhas do sangue.", "exists": true },'+
    '{"id": 8, "title":"Anestesia", "text":"", "exists": true },'+
    '{"id": 9, "title":"Antibiótico", "text":"Medicação contra bactérias.", "exists": true },'+
    '{"id": 10, "title":"Biópsia", "text":"Retirada de pequeno pedaço do tumor ou órgão que é analisada em labo-ratório.", "exists": true },'+
    '{"id": 11, "title":"Benigno", "text":"", "exists": true },'+
    '{"id": 12, "title":"Anemia", "text":"Redução das células vermelhas do sangue.", "exists": true },'+
    '{"id": 13, "title":"Anestesia", "text":"", "exists": true },'+
    '{"id": 14, "title":"Antibiótico", "text":"Medicação contra bactérias.", "exists": true },'+
    '{"id": 15, "title":"Biópsia", "text":"Retirada de pequeno pedaço do tumor ou órgão que é analisada em labo-ratório.", "exists": true },'+
    '{"id": 16, "title":"Benigno", "text":"", "exists": true }]}'
    */

    getVersion = async () => {
        const response = await HttpService.get(DinoAPIURLConstants.PATH_GLOSSARY_VERSION).on('error', this.onError)
        if (response.status === HttpStatus.OK){
            //alert('AEHOO')
            //const glossaryVersionModel = new GlossaryVersionModel(response.body.version)
            LocalStorageService.setGlossaryVersion(response.body.version.toString())
        } 
        else alert('[Versão Glossário] Erro na autenticação com a API do Dino')
        return
    }

    getItems = () : Array<object> => {
        //alert('OOHAAaAaEA')
        localStorage.setItem("Glossary", this.glossary)
        const localGloss = localStorage.getItem("Glossary")
        if (localGloss) {
            const mineGloss = JSON.parse(localGloss)

            //console.log(mineGloss.itemList[0].title)
            return mineGloss.itemList
        }
        return [{}]

    }
    /*= async () => {
        
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
    */
    
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

