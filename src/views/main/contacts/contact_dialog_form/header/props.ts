import PhoneModel from '../../../../../types/contact/PhoneModel'
export default interface AddContactDialogHeaderProps {
  action: number
  name: string
  phones: PhoneModel[]
  color: string
  setColor: React.Dispatch<React.SetStateAction<string>>
  setAddPhoneAction: React.Dispatch<React.SetStateAction<boolean>>
}
