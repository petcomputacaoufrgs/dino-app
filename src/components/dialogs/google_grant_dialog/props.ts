import GoogleScope from '../../../types/auth/google/GoogleScope'
import UserSettingsEntity from '../../../types/user/database/UserSettingsEntity'

export default interface GoogleGrantDialogProps {
	scopes: GoogleScope[]
	title: string
	text: string
	open: boolean
	onDecline: () => void
	onAccept: () => void
	onClose: () => void
}
