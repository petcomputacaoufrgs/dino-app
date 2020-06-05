export default interface AddContactDialogHeaderProps {
  action: 'add' | 'edit' | 'addPhone'
  name: string
  type: number
  color: string
  setColor: React.Dispatch<React.SetStateAction<string>>
  setAddPhoneAction: React.Dispatch<React.SetStateAction<boolean>>
}
