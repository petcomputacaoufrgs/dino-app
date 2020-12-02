import ContactModel from '../../../../../types/contact/ContactModel'

export default interface ContactCardHeaderProps {
  item: ContactModel
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
}
