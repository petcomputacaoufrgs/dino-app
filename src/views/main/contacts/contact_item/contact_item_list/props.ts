import ContactItemModel from '../../../../../services/contact/api_model/ContactModel'

export default interface ContactItemListProps {
  item: ContactItemModel
  onClick: (id: number) => void
}
