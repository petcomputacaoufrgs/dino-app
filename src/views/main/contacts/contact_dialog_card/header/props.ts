import ContactView from "../../../../../types/contact/view/ContactView"
import { PhoneServiceImpl } from '../../../../../services/contact/PhoneService'

export default interface ContactCardHeaderProps {
  item: ContactView
  phoneService: PhoneServiceImpl
  onEdit: React.Dispatch<React.SetStateAction<ContactView | undefined>>
  onDelete: React.Dispatch<React.SetStateAction<ContactView | undefined>>
  onClose: () => void
}
