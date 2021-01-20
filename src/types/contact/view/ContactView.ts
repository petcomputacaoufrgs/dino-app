import ContactEntity from '../database/ContactEntity'
import GoogleContactEntity from '../database/GoogleContactEntity'
import PhoneEntity from '../database/PhoneEntity'

export default interface ContactView {
	contact: ContactEntity
	phones: PhoneEntity[]
	googleContact?: GoogleContactEntity
}
