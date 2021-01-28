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
import { IsStaff } from '../../../../context/private_router'
import EssentialContactService from '../../../../services/contact/EssentialContactService'
import EssentialContactEntity from '../../../../types/contact/database/EssentialContactEntity'

const ContactItems: React.FC<ContactItemsProps> = ({ items }) => {
	const [itemToEdit, setItemToEdit] = useState<ContactView | EssentialContactView | undefined>(undefined,)
	const [itemToView, setItemToView] = useState<ContactView | EssentialContactView | undefined>(undefined,)
	const [itemToDelete, setItemToDelete] = useState<ContactView | EssentialContactView | undefined>(undefined)

	const language = useLanguage()
	const staff = IsStaff()

	const handleOpenItem = (index: number) => {
		setItemToView(items[index])
	}

	const handleAcceptDialogAndDeleteItem = async () => {

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

		if (itemToDelete) {
			await deletePhones(itemToDelete)
			if(staff) {
				await EssentialContactService.delete(itemToDelete.contact as EssentialContactEntity)
			} else {
				await deleteGoogleContact(itemToDelete)
				await ContactService.delete(itemToDelete.contact)
			}
		}
		
		setItemToDelete(undefined)
	}

	const handleCloseDeleteDialog = () => {
		setItemToDelete(undefined)
	}

	return (
		<>
			<List className='contacts__list'>
				{items.map((item, index) => 
					<ContactItemList
						key={index}
						item={item}
						onClick={() => handleOpenItem(index)}
						onEdit={() => setItemToEdit(item)}
						onDelete={() => setItemToDelete(item)}
						onCloseDialog={() => setItemToView(undefined)}
					/>
				)}
			</List>
			{itemToView && (
				<ContactCard
					dialogOpen={itemToView !== undefined}
					onClose={() => setItemToView(undefined)}
					item={itemToView}
					onEdit={() => setItemToEdit(itemToView)}
					onDelete={() => setItemToDelete(itemToView)}
				/>
			)}
			{itemToEdit && (
				<ContactFormDialog
					dialogOpen={itemToEdit !== undefined}
					onClose={() => setItemToEdit(undefined)}
					item={itemToEdit}
					items={items}
					action={Constants.EDIT}
				/>
			)}
			{itemToDelete && (
				<AgreementDialog
					open={itemToDelete !== undefined}
					agreeOptionText={language.data.AGREEMENT_OPTION_TEXT}
					disagreeOptionText={language.data.DISAGREEMENT_OPTION_TEXT}
					description={language.data.DELETE_CONTACT_OPTION_TEXT}
					question={language.data.DELETE_CONTACT_QUESTION}
					onAgree={handleAcceptDialogAndDeleteItem}
					onDisagree={handleCloseDeleteDialog}
				/>
			)}
		</>
	)
}

export default ContactItems
