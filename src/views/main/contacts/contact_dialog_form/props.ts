import PhoneModel from '../../../../types/contact/PhoneModel'
import ContactModel from '../../../../types/contact/ContactModel'

export default interface ContactFormDialogProps {
  dialogOpen: boolean
  setDialogOpen: React.Dispatch<React.SetStateAction<number>>
  action: number
  item?: ContactModel
}
