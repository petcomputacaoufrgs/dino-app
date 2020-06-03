export default interface ContactFormDialogProps {
  itemId?: number
  dialogOpen: boolean
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  action: 'add' | 'edit'
  name?: string
  number?: string
  type?: number
  color?: string
}
