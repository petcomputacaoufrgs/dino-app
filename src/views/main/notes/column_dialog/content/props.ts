export default interface NoteColumnDialogContentProps {
	onTitleChange: (newTitle: string) => void
	title: string
	invalidTitle: boolean
	invalidMessage: string
	inputRef: React.RefObject<HTMLInputElement>
}
