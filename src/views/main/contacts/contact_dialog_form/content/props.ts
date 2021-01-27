import { ReactNode } from 'react'
import ContactEntity from '../../../../../types/contact/database/ContactEntity'
import PhoneEntity from '../../../../../types/contact/database/PhoneEntity'

export interface ContactFormDialogContentProps {
	contact: ContactEntity
	setContact: (value: React.SetStateAction<ContactEntity>) => void
	phones: PhoneEntity[]
	setPhones: (value: React.SetStateAction<PhoneEntity[]>) => void
	children: ReactNode
	invalidName: boolean
	helperTextInvalidPhone: { number: string; text: string }
	handleAddPhone: () => void
	handleDeletePhone: (number: string) => void
}
