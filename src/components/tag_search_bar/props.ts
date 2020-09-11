export default interface SearchBarProps {
  options: string[]
  onTagSearch: (value: string[]) => void
  onTextSearch?: (value: string) => void
  textFieldClass?: string
}