export interface ColorThemeOption {
  name: string
  code: number
}
export default interface ColorThemeContextType {
  current: number
  currentName: string
  updateColorTheme: () => void
  getColorThemeOptions: () => ColorThemeOption[]
}
