import { PhoneServiceImpl } from '../../../../services/contact/PhoneService'
import ContactView from '../../../../types/contact/view/ContactView'

export default interface ContactItemListProps {
  item: ContactView
  phoneService: PhoneServiceImpl
  onEdit: React.Dispatch<React.SetStateAction<ContactView | undefined>>
  onDelete: React.Dispatch<React.SetStateAction<ContactView | undefined>>
  onClick: (id: number) => void
}
