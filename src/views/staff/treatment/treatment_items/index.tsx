import React, { useState } from 'react'
import { List, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core'
import Constants from '../../../../constants/contact/ContactsConstants'
import AgreementDialog from '../../../../components/agreement_dialog'
import { useLanguage } from '../../../../context/language'
import { IsStaff } from '../../../../context/private_router'
import ContactCard from '../../../main/contacts/contact_dialog_card'
import ContactFormDialog from '../../../main/contacts/contact_dialog_form'
import ContactItemList from '../../../main/contacts/contact_list_item'
import TreatmentEntity from '../../../../types/treatment/database/TreatmentEntity'
import TreatmentService from '../../../../services/treatment/TreatmentService'
import OptionsIconButton from '../../../../components/button/icon_button/options_icon_button'
import { Star } from '@material-ui/icons'
import ItemListMenu from '../../../../components/item_list_menu'
import PhoneService from '../../../../services/contact/PhoneService'

interface TreatmentItemsProps {
	items: TreatmentEntity[]
}

const TreatmentItems: React.FC<TreatmentItemsProps> = ({ items }) => {

	const [itemToEdit, setItemToEdit] = useState<TreatmentEntity | undefined>(undefined)
	const [itemToView, setItemToView] = useState<TreatmentEntity | undefined>(undefined)
	const [itemToDelete, setItemToDelete] = useState<TreatmentEntity | undefined>(undefined)
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

	const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget)
	}

	const language = useLanguage()
	const staff = IsStaff()

	const handleOpenCard = (index: number) => {
		setItemToView(items[index])
	}

	const handleAcceptDeleteDialog = async () => {

		if (itemToDelete && staff) {
			await TreatmentService.delete(itemToDelete)
		}
		
		setItemToDelete(undefined)
	}

	const handleCloseDeleteDialog = () => {
		setItemToDelete(undefined)
	}

	const renderTreatmentItemList = (item: TreatmentEntity, index: number) => {
		return (
			<div className='contacts__list__item'>
			<ListItem button divider onClick={() => handleOpenCard(index)}>
				<ListItemText
					primary={item.name}
					//secondary={PhoneService.getPhoneTypes(item.phones, language.data)}
				/>
				<ListItemSecondaryAction>
					<OptionsIconButton dark onClick={handleClickMenu} />
				</ListItemSecondaryAction>
			</ListItem>
			<ItemListMenu
				anchor={anchorEl}
				setAnchor={setAnchorEl}
				onEdit={() => setItemToEdit(item)}
				onDelete={() => setItemToDelete(item)}
				onCloseDialog={() => {}}
				editAvailable
			/>
		</div>
		)
	}

	return (
		<>
			<List className='contacts__list'>
				{items.map((item, index) => renderTreatmentItemList(item, index))}
			</List>
			{itemToView && (
				// <ContactCard
				// 	dialogOpen={itemToView !== undefined}
				// 	onClose={() => setItemToView(undefined)}
				// 	item={itemToView}
				// 	onEdit={setItemToEdit}
				// 	onDelete={setItemToDelete}
				// />
				<></>
			)}
			{itemToEdit && (
				// <ContactFormDialog
				// 	dialogOpen={itemToEdit !== undefined}
				// 	onClose={() => setItemToEdit(undefined)}
				// 	item={itemToEdit}
				// 	items={items}
				// 	action={Constants.EDIT}
				// />
				<></>
			)}
			{itemToDelete && (
				<AgreementDialog
					open={itemToDelete !== undefined}
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

export default TreatmentItems
