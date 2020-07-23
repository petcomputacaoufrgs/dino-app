import PhoneModel from '../../../../../types/contact/PhoneModel'

export interface ContactFormDialogContentProps {

    name: string
    description: string
    phones: PhoneModel[]
    invalidName: boolean
    helperText: { number: string; text: string }
  
  handleDeletePhone: (number: string) => void
  handleChangeName: () => void
  handleChangeDescription: () => void
  handleChangeType: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void
  handleChangeNumber: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void
}
