import ContactView from '../../../../types/contact/view/ContactView'
import EssentialContactView from '../../../../types/contact/view/EssentialContactView'

export default interface ContactCardProps {
	item?: ContactView | EssentialContactView
	dialogOpen: boolean
	onClose: () => void
	onEdit: () => void
	onDelete: () => void
}
