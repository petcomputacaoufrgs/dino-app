import GoogleScope from '../../types/auth/google/GoogleScope'

export default interface GoogleGrantDialogProps {
  scopes: GoogleScope[]
  title: string
  text: string
  open: boolean
  onDecline: () => void
  onAccept: () => void
  onClose: () => void
}
