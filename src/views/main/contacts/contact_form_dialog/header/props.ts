export default interface AddContactDialogHeaderProps {
  action: 'add' | 'edit'
  name: string
  type: number
  color: string
  setColor: React.Dispatch<React.SetStateAction<string>>
}
