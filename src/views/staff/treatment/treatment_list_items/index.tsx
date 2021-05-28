import React, { useState } from 'react'
import { List } from '@material-ui/core'
import AgreementDialog from '../../../../components/agreement_dialog'
import { useLanguage } from '../../../../context/language'
import { IsStaff } from '../../../../context/private_router'
import TreatmentEntity from '../../../../types/treatment/database/TreatmentEntity'
import TreatmentService from '../../../../services/treatment/TreatmentService'
import ItemListMenu from '../../../../components/item_list_menu'
import ListTitle from '../../../../components/list_title'
import TreatmentForm from '../treatment_form'
import TreatmentItemList from './treatment_list_item'

interface TreatmentItemsProps {
	items: TreatmentEntity[],
}

const TreatmentItems: React.FC<TreatmentItemsProps> = ({ items }) => {
	const language = useLanguage()
	const isStaff = IsStaff()

	const [selectedItem, setSelectedItem] = useState<TreatmentEntity>()
	const [toEdit, setToEdit] = useState(false)
	const [toDelete, setToDelete] = useState(false)
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

	const handleAcceptDeleteDialog = async () => {
		if (toDelete && selectedItem && isStaff) {
			await TreatmentService.delete(selectedItem)
		}
		handleCloseDeleteDialog()
	}

	const handleCloseDeleteDialog = () => {
		setToDelete(false)
	}

	const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>, item: TreatmentEntity) => {
    setAnchorEl(event.currentTarget)
    setSelectedItem(item)
  }

	return (
		<>
		  <ListTitle title={language.data.TREATMENTS_AND_FAQS}/>
			<List className='contacts__list'>
				{items.map((item, index) => 
					<TreatmentItemList 
						key={index} 
						item={item}
						onClickMenu={handleClickMenu} 
					/>
				)}
			</List>
			{toEdit && (
				<TreatmentForm 
					open={toEdit} 
					onClose={() => setToEdit(false)} 
					treatment={selectedItem}
				/>
			)}
			{toDelete && (
				<AgreementDialog
					open={toDelete !== undefined}
					description={language.data.DELETE_CONTACT_OPTION_TEXT}
					question={language.data.deleteItemText(language.data.CONTACT)}
					onAgree={handleAcceptDeleteDialog}
					onDisagree={handleCloseDeleteDialog}
				/>
			)}
			<ItemListMenu
				anchor={anchorEl}
				setAnchor={setAnchorEl}
				onEdit={() => setToEdit(true)}
				onDelete={() => setToDelete(true)}
			/>
		</>
	)
}

export default TreatmentItems
