import LanguageContextType from './LanguageContextType'
import SelectedFaqContextType from './SelectedFaqContextType'

export default interface AppSettingsContextType {
  language: LanguageContextType
  selectedFaq: SelectedFaqContextType
}
