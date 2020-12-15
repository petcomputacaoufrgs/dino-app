import ContactView from '../../../../types/contact/view/ContactView'
import { PhoneServiceImpl } from '../../../../services/contact/PhoneService'
import { ContactServiceImpl } from '../../../../services/contact/ContactService'

export interface ContactFormDialogProps {
  dialogOpen: boolean
  onClose: () => void
  action: number
  item?: ContactView
  items: ContactView[]
  contactService: ContactServiceImpl
  phoneService: PhoneServiceImpl
}
