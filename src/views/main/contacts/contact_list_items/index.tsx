import React, { useState } from 'react'
import ContactItemsProps from './props'
import ContactCard from '../contact_dialog_card'
import ContactItemList from '../contact_list_item'
import { List } from '@material-ui/core'
import ContactFormDialog from '../contact_dialog_form'
import Constants from '../../../../constants/contact/ContactsConstants'
import AgreementDialog from '../../../../components/agreement_dialog'
import ContactView from '../../../../types/contact/view/ContactView'
import { useLanguage } from '../../../../context/language'
import PhoneService from '../../../../services/contact/PhoneService'
import ContactService from '../../../../services/contact/ContactService'
import GoogleContactService from '../../../../services/contact/GoogleContactService'
import EssentialContactView from '../../../../types/contact/view/EssentialContactView'
import { isStaff } from '../../../../context/private_router'
import EssentialContactService from '../../../../services/contact/EssentialContactService'
import EssentialContactEntity from '../../../../types/contact/database/EssentialContactEntity'

const ContactItems: React.FC<ContactItemsProps> = ({ items }) => {
	const [contactToEdit, setContactToEdit] = useState<ContactView | EssentialContactView | undefined>(undefined,)
	const [contactToView, setContactToView] = useState<ContactView | EssentialContactView | undefined>(undefined,)
	const [contactToDelete, setContactToDelete] = useState<ContactView | EssentialContactView | undefined>(undefined)

	const language = useLanguage()
	const staff = isStaff()

	const handleOpenCard = (index: number) => {
		setContactToView(items[index])
	}

	const handleAcceptDeleteDialog = async () => {

		async function deleteGoogleContact (
			contactToDelete: ContactView,
		): Promise<void> {
			if (contactToDelete.googleContact) {
				await GoogleContactService.delete(contactToDelete.googleContact)
			}
		}

		async function deletePhones (
			contactToDelete: ContactView | EssentialContactView,
		): Promise<void> {
			if (contactToDelete.phones.length > 0) {
				await PhoneService.deleteAll(contactToDelete.phones)
			}
		}

		if (contactToDelete) {
			await deletePhones(contactToDelete)
			if(staff) {
				await EssentialContactService.delete(contactToDelete.contact as EssentialContactEntity)
			} else {
				await deleteGoogleContact(contactToDelete)
				await ContactService.delete(contactToDelete.contact)
			}
		}
		
		setContactToDelete(undefined)
	}

	const handleCloseDeleteDialog = () => {
		setContactToDelete(undefined)
	}

	return (
		<>
			<List className='contacts__list'>
				{items.map((item, index) => 
					<ContactItemList
						key={index}
						item={item}
						onClick={() => handleOpenCard(index)}
						onEdit={setContactToEdit}
						onDelete={setContactToDelete}
						onCloseDialog={() => setContactToView(undefined)}
					/>
				)}
			</List>
			{contactToView && (
				<ContactCard
					dialogOpen={contactToView !== undefined}
					onClose={() => setContactToView(undefined)}
					item={contactToView}
					onEdit={setContactToEdit}
					onDelete={setContactToDelete}
				/>
			)}
			{contactToEdit && (
				<ContactFormDialog
					dialogOpen={contactToEdit !== undefined}
					onClose={() => setContactToEdit(undefined)}
					item={contactToEdit}
					items={items}
					action={Constants.EDIT}
				/>
			)}
			{contactToDelete && (
				<AgreementDialog
					open={contactToDelete !== undefined}
					agreeOptionText={language.data.AGREEMENT_OPTION_TEXT}
					disagreeOptionText={language.data.DISAGREEMENT_OPTION_TEXT}
					description={language.data.DELETE_CONTACT_OPTION_TEXT}
					question={language.data.DELETE_CONTACT_QUESTION}
					onAgree={handleAcceptDeleteDialog}
					onDisagree={handleCloseDeleteDialog}
				/>
			)}
		</>
	)
}

export default ContactItems
