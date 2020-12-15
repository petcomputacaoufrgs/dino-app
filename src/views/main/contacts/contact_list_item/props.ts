import { PhoneServiceImpl } from '../../../../services/contact/PhoneService'
import ContactView from '../../../../types/contact/view/ContactView';

export default interface ContactItemListProps {
  item: ContactView
  phoneService: PhoneServiceImpl
  setEdit: React.Dispatch<React.SetStateAction<ContactView | undefined>>
  setDelete: React.Dispatch<React.SetStateAction<ContactView | undefined>>
  onClick: (id: number) => void
  children?: JSX.Element | Array<JSX.Element>
}
