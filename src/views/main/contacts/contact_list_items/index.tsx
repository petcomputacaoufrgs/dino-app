import React, { useState } from 'react'
import ContactItemsProps from './props'
import ContactCard from '../contact_dialog_card'
import ContactItemList from './contact_list_item'
import { List } from '@material-ui/core'
import ContactFormDialog from '../contact_dialog_form'
import AgreementDialog from '../../../../components/dialogs/agreement_dialog'
import ContactView from '../../../../types/contact/view/ContactView'
import { useLanguage } from '../../../../context/language'
import PhoneService from '../../../../services/contact/PhoneService'
import ContactService from '../../../../services/contact/ContactService'
import { HasStaffPowers } from '../../../../context/private_router'
import EssentialContactService from '../../../../services/contact/EssentialContactService'
import EssentialContactEntity from '../../../../types/contact/database/EssentialContactEntity'
import ItemListMenu from '../../../../components/list_components/item_list_menu'
import EssentialPhoneService from '../../../../services/contact/EssentialPhoneService'
import CRUDEnum from '../../../../types/enum/CRUDEnum'
import NoItemsList from '../../../../components/list_components/no_items_list'
import ArrayUtils from '../../../../utils/ArrayUtils'
import { cameFromEssential } from '../../../../services/contact/ContactViewService'

const ContactItems: React.FC<ContactItemsProps> = ({ items }) => {

	const [toAction, setToAction] = useState(CRUDEnum.NOP)
	const [selectedItem, setSelectedItem] = useState<ContactView | undefined>(undefined)
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

	const language = useLanguage()
	const isStaff = HasStaffPowers()

	const handleAcceptDialogAndDeleteItem = async () => {
		async function deletePhones (
			contactToDelete: ContactView,
		): Promise<void> {
			if (contactToDelete.phones.length > 0) {
				isStaff 
					? await EssentialPhoneService.deleteAll(contactToDelete.phones) 
					: await PhoneService.deleteAll(contactToDelete.phones)
			}
		}

		if (toAction === CRUDEnum.DELETE && selectedItem) {
			await deletePhones(selectedItem)
			isStaff ? await EssentialContactService.delete(selectedItem.contact as EssentialContactEntity)
				: await ContactService.delete(selectedItem.contact)
		}
		setToAction(CRUDEnum.NOP)
	}

	const handleViewOption = (item: ContactView) => {
		setToAction(CRUDEnum.READ)
		setSelectedItem(item)
	}

	const handleEditOption = () => setToAction(CRUDEnum.UPDATE)

	const handleDeleteOption = () => setToAction(CRUDEnum.DELETE)

	const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>, item: ContactView) => {
    setAnchorEl(event.currentTarget)
    setSelectedItem(item)
  }

	return (
		<>
			{ArrayUtils.isNotEmpty(items) ? 
				<List className='contacts__list dino__list dino__list__padding'>
					{items.map((item, index) => 
						<ContactItemList
							key={index}
							item={item}
							onClick={handleViewOption}
							onClickMenu={handleClickMenu}
						/>
					)}
				</List>
			: <NoItemsList />}
			{selectedItem && (
				<>
				<ContactCard
					dialogOpen={toAction === CRUDEnum.READ}
					onClose={() => setToAction(CRUDEnum.NOP)}
					item={selectedItem}
					onEdit={handleEditOption}
					onDelete={handleDeleteOption}
				/>
				<ContactFormDialog
					dialogOpen={toAction === CRUDEnum.UPDATE}
					onClose={() => setToAction(CRUDEnum.NOP)}
					item={selectedItem}
					items={items}
				/>
				<AgreementDialog
					open={toAction === CRUDEnum.DELETE}
					description={language.data.DELETE_CONTACT_OPTION_TEXT}
					question={language.data.deleteItemText(language.data.CONTACT)}
					onAgree={handleAcceptDialogAndDeleteItem}
					onDisagree={() => setToAction(CRUDEnum.NOP)}
				/>
				<ItemListMenu
					anchor={anchorEl}
					setAnchor={setAnchorEl}
					onEdit={handleEditOption}
					onDelete={handleDeleteOption}
					editUnavailable={cameFromEssential(selectedItem.contact)}
				/>
				</>
			)}
		</>
	)
}

export default ContactItems
