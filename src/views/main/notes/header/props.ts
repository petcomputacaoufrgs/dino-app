export default interface NoteHeaderProps {
  tags: string[]
  onTagSearch: (tags: string[]) => void
  onTextSearch: (text: string) => void
}