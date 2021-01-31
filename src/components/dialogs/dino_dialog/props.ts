export default interface DinoDialogProps {
	open: boolean
	handleClose: () => void
	handleSave: () => void
	header?: React.ReactNode
	actions?: React.ReactNode
}