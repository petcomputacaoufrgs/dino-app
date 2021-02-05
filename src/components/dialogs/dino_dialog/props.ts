export default interface DinoDialogProps {
	open: boolean
	onClose: () => void
	onSave: () => void
	header?: React.ReactNode
	actions?: React.ReactNode
}