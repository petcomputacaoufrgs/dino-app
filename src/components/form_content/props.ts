import { StandardTextFieldProps } from "@material-ui/core/TextField/TextField"

export default interface FormContentProps extends StandardTextFieldProps {
  handleSave: (value: string) => void,
  saveButtonText?: string
  textMaxLengh?: number
  invalidValue?: string,
  children?: React.ReactNode
}