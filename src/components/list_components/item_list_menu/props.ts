import ContactView from '../../../types/contact/view/ContactView'

export default interface ItemListMenuProps {
	anchor: HTMLElement | null
	setAnchor: React.Dispatch<React.SetStateAction<HTMLElement | null>>
	onEdit?: () => void
	onDelete: () => void
	onCloseDialog?: () => void
	editUnavailable?: boolean
	editText?: string
}
