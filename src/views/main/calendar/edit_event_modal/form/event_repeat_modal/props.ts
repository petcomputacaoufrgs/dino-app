export default interface EventRepeatModalProps {
	open: boolean
	repeatType: number
	onRepeatTypeChange: (eventRepeatType: number) => void
	onClose: () => void
}
