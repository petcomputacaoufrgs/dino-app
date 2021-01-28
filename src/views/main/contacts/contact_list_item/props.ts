import ContactView from '../../../../types/contact/view/ContactView'

export default interface ContactItemListProps {
	item: ContactView
	onClick: (id: number) => void
	onEdit: () => void
	onDelete: () => void
	onCloseDialog: () => void
}
