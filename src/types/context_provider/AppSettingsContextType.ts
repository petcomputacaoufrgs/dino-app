import LanguageContextType from './LanguageContextType'
import ColorThemeContextType from './ColorThemeContextType'
import FontSizeContextType from './FontSizeContextType'

export default interface AppSettingsContextType {
  language: LanguageContextType
  fontSize: FontSizeContextType
  colorTheme: ColorThemeContextType
}
