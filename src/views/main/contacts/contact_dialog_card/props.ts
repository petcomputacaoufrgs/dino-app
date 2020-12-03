import ContactModel from '../../../../types/contact/ContactModel'

export default interface ContactCardProps {
  item: ContactModel
  dialogOpen: boolean
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}
