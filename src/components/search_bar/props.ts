export default interface SearchBarProps {
    options: string[]
    onSearch: (value: string[]) => void
    textFieldClass?: string 
}