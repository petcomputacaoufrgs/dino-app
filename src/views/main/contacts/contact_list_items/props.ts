import ContactView from '../../../../types/contact/view/ContactView'
import EssentialContactView from '../../../../types/contact/view/EssentialContactView'

export default interface ContactItemsProps {
	items: Array<ContactView | EssentialContactView>,
}
