export interface FontSizeOption {
  code: number
  name: string
}

export default interface FontSizeContextType {
  currentCode: number
  currentName: string
  updateFontSize: () => void
  getFontSizeOptions: () => FontSizeOption[]
}
