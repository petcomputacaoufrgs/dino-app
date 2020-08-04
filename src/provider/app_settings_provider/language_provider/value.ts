import LanguageBase from '../../../types/languages/LanguageBase'

export interface Language {
  name: string
  code: string
}

export default interface LanguageSubProviderValue {
  current: LanguageBase
  getLanguages: () => Language[]
  updateLanguage: () => LanguageBase
}
