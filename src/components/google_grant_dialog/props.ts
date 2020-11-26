import GoogleScope from "../../types/auth/google/GoogleScope"

export default interface GoogleGrantDialogProps {
    scopes: GoogleScope[]
    title: string
    text: string
    open: boolean
    onClose: () => void
    onAccept: () => void
}