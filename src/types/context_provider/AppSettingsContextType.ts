import LanguageContextType from './LanguageContextType'
import SelectedFaqContextType from './SelectedFaqContextType'
import ColorThemeContextType from './ColorThemeContextType'

export default interface AppSettingsContextType {
  language: LanguageContextType
  selectedFaq: SelectedFaqContextType
  colorTheme: ColorThemeContextType
}
