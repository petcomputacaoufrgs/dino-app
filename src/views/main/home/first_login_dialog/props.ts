export default interface FirstLoginDialogProps {
  open: boolean
  dialog: {
    title: string;
    text: string;
  }
  dialogId: number
  totalDialogs: number
  handleNextDialog: () => void
}