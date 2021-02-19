import ContactView from '../../../../types/contact/view/ContactView'
import UserSettingsEntity from '../../../../types/user/database/UserSettingsEntity'

export default interface ContactItemsProps {
	items: Array<ContactView>
	settings: UserSettingsEntity
}
