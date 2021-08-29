import React, { useState } from 'react'
import CalendarEventTypeItem from './calendar_event_type_item'
import CalendarEventTypeEntity from '../../../../types/calendar/database/CalendarEventTypeEntity'
import ItemListMenu from '../../../../components/list_components/item_list_menu'
import CRUDEnum from '../../../../types/enum/CRUDEnum'
import { CalendarEventTypeForm } from './calendar_event_type_form'
import AddButton from '../../../../components/button/icon_button/add_button'
import './styles.css'

const CalendarSettings: React.FC<{ eventTypes?: CalendarEventTypeEntity[] }> =
	({ eventTypes }) => {
		const [toAction, setToAction] = useState(CRUDEnum.NOP)
		const [selectedItem, setSelectedItem] = useState<CalendarEventTypeEntity>()
		const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

		const handleEditOption = () => setToAction(CRUDEnum.UPDATE)

		const handleDeleteOption = () => setToAction(CRUDEnum.DELETE)

		const handleViewOption = (item: CalendarEventTypeEntity) => {
			setToAction(CRUDEnum.READ)
			setSelectedItem(item)
		}

		const handleClose = () => {
			setSelectedItem(undefined)
			setToAction(CRUDEnum.NOP)
		}

		const handleClickMenu = (
			event: React.MouseEvent<HTMLButtonElement>,
			item?: CalendarEventTypeEntity,
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
				<AddButton handleAdd={() => setToAction(CRUDEnum.CREATE)} />
				<ItemListMenu
					anchor={anchorEl}
					setAnchor={setAnchorEl}
					onEdit={handleEditOption}
					onDelete={handleDeleteOption}
					disable={selectedItem?.userId === undefined}
				/>
			</div>
		)
	}

export default CalendarSettings
