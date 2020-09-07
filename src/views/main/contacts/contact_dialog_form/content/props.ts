import PhoneModel from '../../../../../types/contact/PhoneModel'

export interface ContactFormDialogContentProps {
  name: string
  description: string
  phones: PhoneModel[]
  invalidName: boolean
  helperText: { number: string; text: string }

  handleAddPhone: () => void
  handleDeletePhone: (number: string) => void
  handleChangeName: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleChangeDescription: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleChangeType: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void
  handleChangeNumber: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void
}
