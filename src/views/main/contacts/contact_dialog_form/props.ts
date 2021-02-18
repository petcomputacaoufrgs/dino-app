import ContactView from '../../../../types/contact/view/ContactView'
import UserSettingsEntity from '../../../../types/user/database/UserSettingsEntity'

export interface ContactFormDialogProps {
	dialogOpen: boolean
	onClose: () => void
	action: number
	item?: ContactView
	items: ContactView[]
}
