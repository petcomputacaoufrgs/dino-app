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

    public glossaryJSON = '{"version": 5,' +
        '"itemList": [{"id": 1, "title":"Adenomegalia", "text":"Linfonodos ou gânglios aumentados, também conhecidos como ínguas.", "long_text": "isso é um texto longo", "exists": true },' +
        '{"id": 2, "title":"Anemia", "text":"Redução das células vermelhas do sangue.", "long_text": "isso é um texto longo", "exists": true },' +
        '{"id": 3, "title":"Anestesia", "text":"", "long_text": "isso é um texto longo", "exists": true },' +
        '{"id": 4, "title":"Antibiótico", "text":"Medicação contra bactérias.", "long_text": "isso é um texto longo", "exists": true },' +
        '{"id": 5, "title":"Biópsia", "text":"Retirada de pequeno pedaço do tumor ou órgão que é analisada em labo-ratório.", "long_text": "isso é um texto longo", "exists": true },' +
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

    public glossary: GlossaryModel = new GlossaryModel(0, [])

    getVersion = async () => {

        const response = await HttpService.get(DinoAPIURLConstants.PATH_GLOSSARY_VERSION).on('error', this.onError)

        if (response.status === HttpStatus.OK) {
            //return Number(response.body.version)
            return response.body.version.toString()
        }
        else alert('[Versão Glossário] Erro na autenticação com a API do Dino')
        return LocalStorageService.getGlossaryVersion()
    }

    getItems = async () => {

        const response = await HttpService.get(DinoAPIURLConstants.PATH_GLOSSARY_LIST).on('error', this.onError)
        if (response.status === HttpStatus.OK) {
            alert('OOHEA')
            return response.body.itemsList.toString() //preciso checar o tipo disso
        }
        else alert('[Itens Glossário] Erro na autenticação com a API do Dino')
    }

    checkUpdate = async () => {

        alert('botando uns itens no localstorage pra simular server')
        LocalStorageService.setGlossary(this.glossaryJSON)
        const serverVersion = Number(this.getVersion())

        if (Number(LocalStorageService.getGlossaryVersion()) < serverVersion) {
            let itensModelos = JSON.parse(await this.getItems()).map(item =>
                new GlossaryItemModel(item["id"], item["title"], item["text"], item["exists"]))
            this.glossary = new GlossaryModel(serverVersion, itensModelos)
            console.log(this.glossary)
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

