export default interface EventRepeatModalProps {
  open: boolean
  repeatType: string
  onRepeatTypeChange: (eventRepeatType: string) => void
  onClose: () => void
}