import ContactModel from '../../../../services/contact/api_model/ContactModel'

export default interface ContactCardProps {
  item: ContactModel
  dialogOpen: boolean
  setDialogOpen: React.Dispatch<React.SetStateAction<number>>
  onClose: () => void
  setEdit: React.Dispatch<React.SetStateAction<number>>
  setDelete: React.Dispatch<React.SetStateAction<number>>
}
