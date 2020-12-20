import { PhoneServiceImpl } from "../../../../services/contact/PhoneService"
import ContactView from "../../../../types/contact/view/ContactView"

export default interface ContactCardProps {
  item?: ContactView
  phoneService: PhoneServiceImpl
  dialogOpen: boolean
  onClose: () => void
  onEdit: React.Dispatch<React.SetStateAction<ContactView | undefined>>
  onDelete: React.Dispatch<React.SetStateAction<ContactView | undefined>>
}