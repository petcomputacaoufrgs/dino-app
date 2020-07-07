export default interface PhoneFieldsProps {
  type: number
  onChangeType: (event: React.ChangeEvent<HTMLInputElement>) => void
  number: string
  onChangeNumber: (event: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  error?: boolean
  helperText?: string
  handleDeletePhone: (number: string) => void
}
