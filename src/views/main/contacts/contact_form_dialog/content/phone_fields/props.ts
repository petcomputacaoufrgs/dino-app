export default interface PhoneFieldsProps {
  type: number
  onChangeType: (event: React.ChangeEvent<HTMLInputElement>) => void
  number: string
  onChangeNumber: (event: React.ChangeEvent<HTMLInputElement>) => void
  required?: true
  error?: boolean
}
