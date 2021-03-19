import ContactView from '../../../../types/contact/view/ContactView'
import EssentialContactView from '../../../../types/contact/view/EssentialContactView'

export default interface ContactFormDialogProps {
	dialogOpen: boolean
	onClose: () => void
	item?: ContactView | EssentialContactView
	items: Array<ContactView | EssentialContactView>
}