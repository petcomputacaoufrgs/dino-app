import ContactModel from '../../../../../types/contact/ContactModel'

export default interface ContactCardHeaderProps {
  item: ContactModel
  setEdit: React.Dispatch<React.SetStateAction<number>>
  setDelete: React.Dispatch<React.SetStateAction<number>>
  onClose: () => void
}
