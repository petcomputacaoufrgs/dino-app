export interface ColorThemeOption {
  code: number
  name: string
}
export default interface ColorThemeContextType {
  currentCode: number
  currentName: string
  updateColorTheme: () => void
  getColorThemeOptions: () => ColorThemeOption[]
}
