import PhoneModel from '../../../../services/contact/api_model/PhoneModel'

export default interface ContactFormDialogProps {
  dialogOpen: boolean
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  action: 'add' | 'edit'
  id?: number
  name?: string
  phones?: Array<PhoneModel>
  color?: string
}
