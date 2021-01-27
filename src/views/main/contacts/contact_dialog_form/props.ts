import ContactView from '../../../../types/contact/view/ContactView'
import EssentialContactView from '../../../../types/contact/view/EssentialContactView'

export interface ContactFormDialogProps {
	dialogOpen: boolean
	onClose: () => void
	action: 1 | 2
	item?: ContactView | EssentialContactView
	items: Array<ContactView | EssentialContactView>
}
