import React, { useState } from 'react'
import Accordion from 'react-bootstrap/Accordion'
import ListTitle from '../../../../components/list_components/list_title'
import AddButton from '../../../../components/button/circular_button/add_button'
import FaqItemForm from '../faq_item_form'
import { HasStaffPowers } from '../../../../context/private_router'
import { useLanguage } from '../../../../context/language'
import FaqItemEntity from '../../../../types/faq/database/FaqItemEntity'
import ItemListMenu from '../../../../components/list_components/item_list_menu'
import FaqItem from './faq_list_item'
import AgreementDialog from '../../../../components/agreement_dialog'
import FaqItemService from '../../../../services/faq/FaqItemService'
import FaqView from '../../../../types/faq/view/FaqView'
import CRUDEnum from '../../../../types/enum/CRUDEnum'

const FaqItems: React.FC<{ data: FaqView }> = ({ data }): JSX.Element => {
	const language = useLanguage()
	const isStaff = HasStaffPowers()
	const [toAction, setToAction] = useState(CRUDEnum.NOP)
	const [selectedItem, setSelectedItem] = useState<FaqItemEntity>()

	const [anchor, setAnchor] = React.useState<null | HTMLElement>(null)

	const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>, item: FaqItemEntity) => {
		setAnchor(event.currentTarget)
		setSelectedItem(item)
	}

	const handleAcceptDeleteDialog = () => {
		if (toAction === CRUDEnum.DELETE && selectedItem) {
			FaqItemService.delete(selectedItem)
			setSelectedItem(undefined)
		}
		handleCloseDialog()
	}

	const handleCloseDialog = () => {
		setToAction(CRUDEnum.NOP)
  }

	return (
		<div className='faq-items dino__text__wrap'>
			<ListTitle title={language.data.titleFAQTreatmentText(data.treatment.name)}/>
			{data && (
				<Accordion className='dino__accordion'>
					{data.faqItems?.map((item, index) =>	
						<FaqItem 
							key={index} 
							item={item} 
							onClickMenu={handleClickMenu} 
						/>
					)}
				</Accordion>
			)}
			{isStaff && (
				<>
					<AddButton
						handleAdd={() => setToAction(CRUDEnum.CREATE)}
						label={language.data.FAQ}
					/>
					{toAction === CRUDEnum.CREATE && <FaqItemForm 
						open={toAction === CRUDEnum.CREATE} 
						onClose={handleCloseDialog}
						treatment={data.treatment}
					/>}
					{toAction === CRUDEnum.UPDATE && <FaqItemForm 
						open={toAction === CRUDEnum.UPDATE} 
						onClose={handleCloseDialog}
						treatment={data.treatment}
						faqItem={selectedItem}
					/>}
					<AgreementDialog
						open={toAction === CRUDEnum.DELETE}
            question={language.data.deleteItemText(language.data.FAQ_ITEM)}
						onAgree={handleAcceptDeleteDialog}
						onDisagree={handleCloseDialog}
					/>
					<ItemListMenu
						anchor={anchor}
						setAnchor={setAnchor}
						onEdit={() => setToAction(CRUDEnum.UPDATE)}
						onDelete={() => setToAction(CRUDEnum.DELETE)}
					/>
				</>
			)}
		</div>
	)
}

export default FaqItems
