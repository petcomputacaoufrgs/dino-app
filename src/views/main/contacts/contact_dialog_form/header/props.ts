import PhoneModel from '../../../../../types/contact/PhoneModel'
export default interface AddContactDialogHeaderProps {
  action: number
  name: string
  color?: number
  handleChangeColor: () => void
  handleCloseDialog: () => void
}
