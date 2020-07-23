import PhoneModel from '../../../../../types/contact/PhoneModel'
export default interface AddContactDialogHeaderProps {
  action: number
  name: string
  phones: PhoneModel[]
  color: string
  handleChangeColor: () => void
  handleAddPhone: () => void
}
