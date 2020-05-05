import LanguageSet from "../../language/LanguageSet"

export interface Language {
    name: string
    code: string
}

export default interface LanguageContextValue {
    currentLanguage: LanguageSet
    getLanguageList: () => Language[]
    updateLanguage: () => void
}