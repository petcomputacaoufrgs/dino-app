import ContactItemModel from '../../../../types/contact/ContactModel'

export default interface ContactItemListProps {
  item: ContactItemModel
  onEdit: () => void
  onDelete: () => void
  onClick: (id: number) => void
}
