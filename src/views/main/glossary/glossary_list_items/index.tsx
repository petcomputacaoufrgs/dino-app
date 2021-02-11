import React, { useState } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import { useLanguage } from '../../../../context/language'
import GlossaryItemProps from './props'
import { IsStaff } from '../../../../context/private_router'
import GlossaryItemEntity from '../../../../types/glossary/database/GlossaryItemEntity'
import AgreementDialog from '../../../../components/agreement_dialog'
import GlossaryItemForm from '../glossary_item_form'
import GlossaryService from '../../../../services/glossary/GlossaryService'
import GlossaryListItem from './glossary_list_item'
import ItemListMenu from '../../../../components/item_list_menu'

const GlossaryItems = ({ items }: GlossaryItemProps): JSX.Element => {
	const language = useLanguage()
	const staff = IsStaff()

	const [toEdit, setToEdit] = useState(false)
	const [toDelete, setToDelete] = useState(false)
	const [selectedItem, setSelectedItem] = useState<GlossaryItemEntity>()
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

	const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>, item: GlossaryItemEntity) => {
    setAnchorEl(event.currentTarget)
    setSelectedItem(item)
  }

	const handleDelete = () => {
		if(toDelete && selectedItem) {
			GlossaryService.delete(selectedItem)
			setToDelete(false)
			setSelectedItem(undefined)
		}
	}

	return (
		<div className='glossary__items'>
			<Accordion className='accordion'>
				{items.map((item, index) => 
					<GlossaryListItem 
						item={item} 
						key={index}
						onClickMenu={handleClickMenu} 
					/>
				)}
			</Accordion>
			{ staff && (
				<>
					<GlossaryItemForm
						open={toEdit}
						handleClose={() => setToEdit(false)}
						item={selectedItem}
					/>
					<AgreementDialog
						open={toDelete}
						description={language.data.DELETE_CONTACT_OPTION_TEXT}
						question={language.data.DELETE_CONTACT_QUESTION}
						onAgree={handleDelete}
						onDisagree={() => setToDelete(false)}
					/>
					<ItemListMenu
						anchor={anchorEl}
						setAnchor={setAnchorEl}
						onEdit={() => setToEdit(true)}
						onDelete={() => setToDelete(true)}
					/>
				</>
			)}
		</div>
	)
}

export default GlossaryItems
