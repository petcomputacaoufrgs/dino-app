import LanguageContextType from './LanguageContextType'
import SelectedFaqContextType from './SelectedFaqContextType'
import ColorThemeContextType from './ColorThemeContextType'
import FontSizeContextType from './FontSizeContextType'

export default interface AppSettingsContextType {
  language: LanguageContextType
  fontSize: FontSizeContextType
  selectedFaq: SelectedFaqContextType
  colorTheme: ColorThemeContextType
}
