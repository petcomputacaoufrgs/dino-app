import ContactModel from '../../../../types/contact/ContactModel'

export default interface ContactCardProps {
  item: ContactModel
  dialogOpen: boolean
  onClose: () => void
  setEdit: React.Dispatch<React.SetStateAction<number>>
  setDelete: React.Dispatch<React.SetStateAction<number>>
}
