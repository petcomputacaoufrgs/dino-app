import LanguageSet from "../../language/LanguageSet";

/**
 * @description Define os atributos do contexto do language provider
 */
export default class LanguageProviderContext {
    /** Classe contendo os textos utilizados no projeto */
    text: LanguageSet 

    constructor(text: LanguageSet) {
        this.text = text
    }
}