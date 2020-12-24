import ContactView from '../../../../types/contact/view/ContactView'
import { ContactServiceImpl } from '../../../../services/contact/ContactService'
import { PhoneServiceImpl } from '../../../../services/contact/PhoneService'

export interface ContactFormDialogProps {
  dialogOpen: boolean
  onClose: () => void
  action: number
  item?: ContactView
  items: ContactView[]
  contactService: ContactServiceImpl
  phoneService: PhoneServiceImpl
}
