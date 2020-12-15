import ContactView from '../../../../types/contact/view/ContactView'
import { ContactServiceImpl } from '../../../../services/contact/ContactService'
import { GoogleContactServiceImpl } from '../../../../services/contact/GoogleContactService'
import { PhoneServiceImpl } from '../../../../services/contact/PhoneService'
import PhoneEntity from '../../../../types/contact/database/PhoneEntity'

export default interface ContactItemsProps {
  items: Array<ContactView>,
  contactService: ContactServiceImpl,
  googleContactService: GoogleContactServiceImpl,
  phoneService: PhoneServiceImpl
}
