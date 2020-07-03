import LanguageSet from './languages/LanguageBase'

export interface Language {
  name: string
  code: string
}

export default interface LanguageSubProviderValue {
  current: LanguageSet
  getLanguageList: () => Language[]
  updateLanguage: () => LanguageSet
}
