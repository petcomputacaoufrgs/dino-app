import ContactEntity from '../database/ContactEntity'
import PhoneEntity from '../database/PhoneEntity'

export default interface ContactView {
	contact: ContactEntity
	phones: PhoneEntity[]
}
