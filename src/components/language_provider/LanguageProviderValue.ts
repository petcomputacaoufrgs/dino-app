import LanguageSet from "../../language/LanguageSet"

export interface Language {
    name: string
    code: string
}

export default interface LanguageProviderValue {
    currentLanguage: LanguageSet
    getLanguageList: () => Language[]
    updateLanguage: () => void
}