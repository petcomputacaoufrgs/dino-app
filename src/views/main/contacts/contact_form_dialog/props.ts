import PhoneModel from '../../../../services/contact/api_model/PhoneModel'

export default interface ContactFormDialogProps {
  dialogOpen: boolean
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  action: 'add' | 'edit' | 'addPhone'
  id?: number
  name?: string
  description?: string
  phones?: Array<PhoneModel>
  color?: string
}
