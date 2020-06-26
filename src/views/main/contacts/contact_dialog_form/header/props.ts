import PhoneModel from '../../../../../services/contact/api_model/PhoneModel'
export default interface AddContactDialogHeaderProps {
  action: number
  name: string
  phones: PhoneModel[]
  color: string
  setColor: React.Dispatch<React.SetStateAction<string>>
  setAddPhoneAction: React.Dispatch<React.SetStateAction<boolean>>
}
