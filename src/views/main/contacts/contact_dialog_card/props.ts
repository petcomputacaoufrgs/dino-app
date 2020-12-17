import ContactView from '../../../../types/contact/view/ContactView';
import { PhoneServiceImpl } from '../../../../services/contact/PhoneService';

export default interface ContactCardProps {
  item: ContactView
  phoneService: PhoneServiceImpl
  dialogOpen: boolean
  onClose: () => void
  onEdit: React.Dispatch<React.SetStateAction<number>>
  onDelete: React.Dispatch<React.SetStateAction<number>>
}
