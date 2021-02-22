import React, { useState } from 'react'
import FaqItemsProps from './props'
import Accordion from 'react-bootstrap/Accordion'
import ListTitle from '../../../../components/list_title'
import AddButton from '../../../../components/button/circular_button/add_button'
import FaqItemForm from '../faq_item_form'
import { IsStaff } from '../../../../context/private_router'
import { useLanguage } from '../../../../context/language'
import FaqItemEntity from '../../../../types/faq/database/FaqItemEntity'
import ItemListMenu from '../../../../components/item_list_menu'
import FaqItem from './faq_list_item'
import AgreementDialog from '../../../../components/agreement_dialog'
import FaqItemService from '../../../../services/faq/FaqItemService'

const FaqItems = ({ data }: FaqItemsProps): JSX.Element => {
	
	const language = useLanguage()
	const staff = IsStaff()

	const [toAdd, setToAdd] = useState(false)
	const [toEdit, setToEdit] = useState(false)
	const [toDelete, setToDelete] = useState(false)
	const [selectedItem, setSelectedItem] = useState<FaqItemEntity>()

	const [anchor, setAnchor] = React.useState<null | HTMLElement>(null)

	const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>, item: FaqItemEntity) => {
		setAnchor(event.currentTarget)
		setSelectedItem(item)
	}

	const handleAcceptDeleteDialog = async () => {
		if (toDelete && selectedItem) {
			await FaqItemService.delete(selectedItem)
		}
		handleCloseDeleteDialog()
	}

	const handleCloseDeleteDialog = () => {
		setToDelete(false)
	}

	return (
		<div className='faq-items'>
			<ListTitle title={language.data.titleFAQTreatmentText(data.treatment.name)}/>
			{data && (
				<Accordion className='faq-items__accordion'>
					{data.faqItems.map((item, index) =>	
						<FaqItem 
							key={index} 
							item={item} 
							onClickMenu={handleClickMenu} 
						/>
					)}
				</Accordion>
			)}
			{staff && (
				<>
					<AddButton
						handleAdd={() => setToAdd(true)}
						label={`${language.data.ADD_ARIA_LABEL} ${language.data.FAQ}`}
					/>
					{toAdd && <FaqItemForm 
						open={toAdd} 
						onClose={() => setToAdd(false)}
						treatment={data.treatment}
					/>}
					{toEdit && <FaqItemForm 
						open={toEdit} 
						onClose={() => setToEdit(false)}
						treatment={data.treatment}
						faqItem={selectedItem}
					/>}
					{toDelete && <AgreementDialog
						open={toDelete !== undefined}
            question={language.data.deleteItemText(language.data.FAQ)}
						onAgree={handleAcceptDeleteDialog}
						onDisagree={handleCloseDeleteDialog}
					/>}
					<ItemListMenu
						anchor={anchor}
						setAnchor={setAnchor}
						onEdit={() => setToEdit(true)}
						onDelete={() => setToDelete(true)}
					/>
				</>
			)}
		</div>
	)
}

export default FaqItems
