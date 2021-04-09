import React, { useState } from 'react'
import ContactItemsProps from './props'
import ContactCard from '../contact_dialog_card'
import ContactItemList from '../contact_list_item'
import { List } from '@material-ui/core'
import ContactFormDialog from '../contact_dialog_form'
import AgreementDialog from '../../../../components/agreement_dialog'
import ContactView from '../../../../types/contact/view/ContactView'
import { useLanguage } from '../../../../context/language'
import PhoneService from '../../../../services/contact/PhoneService'
import ContactService from '../../../../services/contact/ContactService'
import { IsStaff } from '../../../../context/private_router'
import EssentialContactService from '../../../../services/contact/EssentialContactService'
import EssentialContactEntity from '../../../../types/contact/database/EssentialContactEntity'
import ItemListMenu from '../../../../components/item_list_menu'
import ContactEntity from '../../../../types/contact/database/ContactEntity'
import EssentialPhoneService from '../../../../services/contact/EssentialPhoneService'

const ContactItems: React.FC<ContactItemsProps> = ({ items }) => {
	const [toEdit, setToEdit] = useState(false)
	const [toView, setToView] = useState(false)
	const [toDelete, setToDelete] = useState(false)
	const [selectedItem, setSelectedItem] = useState<ContactView | undefined>(undefined)
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

	const language = useLanguage()
	const staff = IsStaff()

	const handleAcceptDialogAndDeleteItem = async () => {
		async function deletePhones (
			contactToDelete: ContactView,
		): Promise<void> {
			if (contactToDelete.phones.length > 0) {
				console.log(contactToDelete)
				staff ? await EssentialPhoneService.deleteAll(contactToDelete.phones) 
					: await PhoneService.deleteAll(contactToDelete.phones)
			}
		}

		if (toDelete && selectedItem) {
			await deletePhones(selectedItem)
			if(staff) {
				await EssentialContactService.delete(selectedItem.contact as EssentialContactEntity)
			} else {
				await ContactService.delete(selectedItem.contact)
			}
		}
		setToDelete(false)
	}

	const handleViewOption = (item: ContactView) => {
		setToView(true)
		setSelectedItem(item)
	}

	const handleEditOption = () => {
		setToEdit(true)
	}

	const handleDeleteOption = () => {
		setToDelete(true)
	}

	const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>, item: ContactView) => {
    setAnchorEl(event.currentTarget)
    setSelectedItem(item)
  }

	const isEditUnavailable = selectedItem 
	&& (selectedItem.contact as ContactEntity)
	.localEssentialContactId !== undefined

	return (
		<>
			<List className='contacts__list'>
				{items.map((item, index) => 
					<ContactItemList
						key={index}
						item={item}
						onClick={handleViewOption}
						onClickMenu={handleClickMenu}
					/>
				)}
			</List>
			{selectedItem && (
				<>
				<ContactCard
					dialogOpen={toView}
					onClose={() => setToView(false)}
					item={selectedItem}
					onEdit={handleEditOption}
					onDelete={handleDeleteOption}
				/>
				<ContactFormDialog
					dialogOpen={toEdit}
					onClose={() => setToEdit(false)}
					item={selectedItem}
					items={items}
				/>
				<AgreementDialog
					open={toDelete}
					description={language.data.DELETE_CONTACT_OPTION_TEXT}
					question={language.data.deleteItemText(language.data.CONTACT)}
					onAgree={handleAcceptDialogAndDeleteItem}
					onDisagree={() => setToDelete(false)}
				/>
				<ItemListMenu
					anchor={anchorEl}
					setAnchor={setAnchorEl}
					onEdit={handleEditOption}
					onDelete={handleDeleteOption}
					onCloseDialog={() => setToView(false)}
					editUnavailable={isEditUnavailable}
				/>
				</>
			)}
		</>
	)
}

export default ContactItems
