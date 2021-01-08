import ContactView from '../../../../types/contact/view/ContactView'

export interface ContactFormDialogProps {
  dialogOpen: boolean
  onClose: () => void
  action: number
  item?: ContactView
  items: ContactView[]
}
