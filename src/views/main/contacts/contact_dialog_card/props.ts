import ContactView from '../../../../types/contact/view/ContactView';
import { PhoneServiceImpl } from '../../../../services/contact/PhoneService';

export default interface ContactCardProps {
  item: ContactView
  phoneService: PhoneServiceImpl
  dialogOpen: boolean
  onClose: () => void
  setEdit: React.Dispatch<React.SetStateAction<ContactView | undefined>>
  setDelete: React.Dispatch<React.SetStateAction<ContactView | undefined>>
}
