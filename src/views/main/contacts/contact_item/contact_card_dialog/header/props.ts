import ContactModel from '../../../../../../services/contact/api_model/ContactModel'

export default interface ContactCardHeaderProps {
  item: ContactModel
  setEdit: React.Dispatch<React.SetStateAction<number>>
  setDelete: React.Dispatch<React.SetStateAction<number>>
  onClose: () => void
}
