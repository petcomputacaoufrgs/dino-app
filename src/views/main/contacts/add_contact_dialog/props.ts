export default interface ContactFormDialogProps {
  itemId?: number
  dialogOpen: boolean
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  action: 'add' | 'edit'
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
  number: string
  setNumber: React.Dispatch<React.SetStateAction<string>>
  type: number
  setType: React.Dispatch<React.SetStateAction<number>>
  color: string
  setColor: React.Dispatch<React.SetStateAction<string>>
}
