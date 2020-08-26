export default interface AddAlarmModalProps {
  open: boolean
  onClose: () => void
  onSave: (time: number, type: number) => void
}