import LanguageBase from '../languages/LanguageBase'

export interface Language {
  name: string
  code: string
}

export default interface LanguageContextType {
  current: LanguageBase
  getLanguages: () => Language[]
  updateLanguage: () => LanguageBase
}
