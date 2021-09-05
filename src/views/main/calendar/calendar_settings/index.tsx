import React, { useState } from 'react'
import CalendarEventTypeItem from './calendar_event_type_item'
import EventTypeEntity from '../../../../types/calendar/database/EventTypeEntity'
import ItemListMenu from '../../../../components/list_components/item_list_menu'
import CRUDEnum from '../../../../types/enum/CRUDEnum'
import { CalendarEventTypeForm } from './calendar_event_type_form'
import AddButton from '../../../../components/button/icon_button/add_button'
import './styles.css'
import { useLanguage } from '../../../../context/language'
import CalendarEventTypeService from '../../../../services/calendar/CalendarEventTypeService'
import AgreementDialog from '../../../../components/dialogs/agreement_dialog'

const CalendarSettings: React.FC<{ eventTypes?: EventTypeEntity[] }> = ({
	eventTypes,
}) => {
	const language = useLanguage()
	const [toAction, setToAction] = useState(CRUDEnum.NOP)
	const [selectedItem, setSelectedItem] = useState<EventTypeEntity>()
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

	const handleEditOption = () => setToAction(CRUDEnum.UPDATE)

	const handleDeleteOption = () => setToAction(CRUDEnum.DELETE)

	const handleAcceptDialogAndDeleteItem = () => {
		if (selectedItem) CalendarEventTypeService.delete(selectedItem)
	}

	const handleViewOption = (item: EventTypeEntity) => {
		setToAction(CRUDEnum.READ)
		setSelectedItem(item)
	}

	const handleClose = () => {
		setSelectedItem(undefined)
		setToAction(CRUDEnum.NOP)
	}

	const handleClickMenu = (
		event: React.MouseEvent<HTMLButtonElement>,
		item?: EventTypeEntity,
	) => {
		setAnchorEl(event.currentTarget)
		if (item) setSelectedItem(item)
	}

	return (
		<div className='calendar_settings'>
			<div className='event_type__list'>
				{eventTypes?.map((e, index) => (
					<CalendarEventTypeItem
						key={index}
						item={e}
						onClick={handleViewOption}
						onClickMenu={handleClickMenu}
					/>
				))}
			</div>
			<CalendarEventTypeForm
				open={toAction === CRUDEnum.CREATE || toAction === CRUDEnum.UPDATE}
				item={selectedItem}
				onClose={handleClose}
			/>
			<AddButton
				label={language.data.EVENT_TYPE_LABEL}
				handleAdd={() => setToAction(CRUDEnum.CREATE)}
			/>
			<ItemListMenu
				anchor={anchorEl}
				setAnchor={setAnchorEl}
				onEdit={handleEditOption}
				onDelete={handleDeleteOption}
				disable={selectedItem?.userId === undefined}
			/>
			<AgreementDialog
				open={toAction === CRUDEnum.DELETE}
				description={language.data.DELETE_ITEM_OPTION_TEXT}
				question={language.data.deleteItemText(language.data.EVENT_TYPE_LABEL)}
				onAgree={handleAcceptDialogAndDeleteItem}
				onDisagree={() => setToAction(CRUDEnum.NOP)}
			/>
		</div>
	)
}

export default CalendarSettings
