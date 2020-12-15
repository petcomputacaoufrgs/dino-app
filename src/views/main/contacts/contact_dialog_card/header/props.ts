import ContactView from "../../../../../types/contact/view/ContactView"
import { PhoneServiceImpl } from '../../../../../services/contact/PhoneService'

export default interface ContactCardHeaderProps {
  item: ContactView
  phoneService: PhoneServiceImpl
  setEdit: React.Dispatch<React.SetStateAction<ContactView | undefined>>
  setDelete: React.Dispatch<React.SetStateAction<ContactView | undefined>>
  onClose: () => void
}
