import { ReactNode } from 'react'
import PhoneEntity from '../../../../../types/contact/database/PhoneEntity'

export interface ContactFormDialogContentProps {
  children: ReactNode
  name: string
  description: string
  phones: PhoneEntity[]
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
