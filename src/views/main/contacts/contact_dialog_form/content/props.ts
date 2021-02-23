import { ReactNode } from 'react'
import ContactEntity from '../../../../../types/contact/database/ContactEntity'
import PhoneEntity from '../../../../../types/contact/database/PhoneEntity'
import { InvalidPhoneProps } from '../props'

export interface ContactFormDialogContentProps {
	contact: ContactEntity
	phones: PhoneEntity[]
	children: ReactNode
	invalidName: boolean
	helperTextInvalidPhone?: InvalidPhoneProps
	setContact: (value: React.SetStateAction<ContactEntity>) => void
	setPhones: (value: React.SetStateAction<PhoneEntity[]>) => void
	handleAddPhone: () => void
	handleDeletePhone: (number: string) => void
}
