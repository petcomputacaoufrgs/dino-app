import LanguageSet from '../../../types/languages/LanguageBase'

export interface Language {
  name: string
  code: string
}

export default interface LanguageSubProviderValue {
  current: LanguageSet
  getLanguages: () => Language[]
  updateLanguage: () => LanguageSet
}
