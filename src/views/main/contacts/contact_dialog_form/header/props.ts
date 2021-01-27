import ContactEntity from "../../../../../types/contact/database/ContactEntity"

export default interface AddContactDialogHeaderProps {
	action: number
	contact: ContactEntity
	setContact: (value: React.SetStateAction<ContactEntity>) => void
	handleCloseDialog: () => void
}
