import ContactItemModel from '../../../../../services/contact/api_model/ContactModel'

export default interface ContactItemListProps {
  item: ContactItemModel
  onOpen: (id: number) => void
}
