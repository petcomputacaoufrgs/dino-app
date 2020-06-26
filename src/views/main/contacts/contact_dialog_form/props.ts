import PhoneModel from '../../../../services/contact/api_model/PhoneModel'
import ContactModel from '../../../../services/contact/api_model/ContactModel'

export default interface ContactFormDialogProps {
  dialogOpen: boolean
  setDialogOpen: React.Dispatch<React.SetStateAction<number>>
  action: number
  item?: ContactModel
}
