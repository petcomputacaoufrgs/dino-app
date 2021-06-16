import React, { useState } from 'react'
import { List } from '@material-ui/core'
import AgreementDialog from '../../../../components/agreement_dialog'
import { useLanguage } from '../../../../context/language'
import { HasStaffPowers } from '../../../../context/private_router'
import TreatmentEntity from '../../../../types/treatment/database/TreatmentEntity'
import TreatmentService from '../../../../services/treatment/TreatmentService'
import ItemListMenu from '../../../../components/list_components/item_list_menu'
import ListTitle from '../../../../components/list_components/list_title'
import TreatmentForm from '../treatment_form'
import TreatmentItemList from './treatment_list_item'
import CRUDEnum from '../../../../types/enum/CRUDEnum'

interface TreatmentItemsProps {
	items: TreatmentEntity[],
}

const TreatmentItems: React.FC<TreatmentItemsProps> = ({ items }) => {
	const language = useLanguage()
	const isStaff = HasStaffPowers()

	const [toAction, setToAction] = useState(CRUDEnum.NOP)
	const [selectedItem, setSelectedItem] = useState<TreatmentEntity>()
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

	const handleAcceptDeleteDialog = async () => {
		if (toAction === CRUDEnum.DELETE && selectedItem && isStaff) {
			await TreatmentService.delete(selectedItem)
		}
		handleCloseDialog()
	}

	const handleCloseDialog = () => {
		setToAction(CRUDEnum.NOP)
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
			{toAction === CRUDEnum.UPDATE && (
				<TreatmentForm 
					open={toAction === CRUDEnum.UPDATE} 
					onClose={handleCloseDialog} 
					treatment={selectedItem}
				/>
			)}
			<AgreementDialog
				open={toAction === CRUDEnum.DELETE}
				question={language.data.deleteItemText(language.data.TREATMENT)}
				onAgree={handleAcceptDeleteDialog}
				onDisagree={handleCloseDialog}
			/>
			<ItemListMenu
				anchor={anchorEl}
				setAnchor={setAnchorEl}
				onEdit={() => setToAction(CRUDEnum.UPDATE)}
				onDelete={() => setToAction(CRUDEnum.DELETE)}
			/>
		</>
	)
}

export default TreatmentItems
