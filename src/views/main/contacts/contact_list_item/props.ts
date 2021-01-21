import ContactView from '../../../../types/contact/view/ContactView'

export default interface ContactItemListProps {
	item: ContactView
	onClick: (id: number) => void
	onEdit: React.Dispatch<React.SetStateAction<ContactView | undefined>>
	onDelete: React.Dispatch<React.SetStateAction<ContactView | undefined>>
	onCloseDialog: () => void
}
