import React, { useEffect, useState } from 'react'
import SelectDate from '../../../../components/calendar/select_date'
import SelectEventType from '../../../../components/calendar/select_event_type'
import SelectNotification from '../../../../components/calendar/select_notification'
import SelectRepeat from '../../../../components/calendar/select_repeat'
import SelectTime from '../../../../components/calendar/select_time'
import DinoDialog from '../../../../components/dialogs/dino_dialog'
import ItemListMenu from '../../../../components/list_components/item_list_menu'
import { DinoTextfield } from '../../../../components/textfield'
import DataConstants from '../../../../constants/app_data/DataConstants'
import { useLanguage } from '../../../../context/language'
import CalendarEventService from '../../../../services/calendar/EventService'
import EventTypeEntity from '../../../../types/calendar/database/EventTypeEntity'
import { EventView } from '../../../../types/calendar/view/CalendarView'
import StringUtils from '../../../../utils/StringUtils'
import EventDialogFormProps from './props'

const getEvent = (item?: EventView) =>
	item?.event || {
		title: '',
		description: '',
		date: new Date(),
	}

export const getNewEventView = (date: Date): EventView => {
	const event = getEvent()
	event.date = date
	return { event }
}

const getType = (item?: EventView, eventTypes?: EventTypeEntity[]) => {
	if (item) {
		const eventType = eventTypes?.find(
			t => t.localId === item?.event.typeLocalId,
		)
		return eventType
	}
	return (eventTypes && eventTypes[0]) || undefined
}

export const EventDialogForm: React.FC<EventDialogFormProps> = props => {
	const language = useLanguage()

	const [event, setEvent] = useState(getEvent(props.item))
	const [type, setType] = useState<EventTypeEntity | undefined>(
		getType(props.item, props.eventTypes),
	)
	const [error, setError] = useState<string>()

	const handleChangeType = (index: number) => {
		if (props.eventTypes) {
			const newType = props.eventTypes[index]
			setType(newType)
		}
	}

	let beginHour = ''
	let beginMinute = ''
	const endTime = props.item?.event.endTime?.split(':')
	
	if(props.item)
	{
		beginHour = StringUtils.toStringWithZeros(props.item?.event.date.getHours(), 2)
		beginMinute = StringUtils.toStringWithZeros(props.item?.event.date.getMinutes(), 2)
	}

	useEffect(() => {
		if (props.open) {
			setEvent(getEvent(props.item))
			setType(getType(props.item, props.eventTypes))
		}
	}, [props.open])

	const handleSave = async () => {
		if (StringUtils.isEmpty(event.title)) {
			return setError(language.data.EMPTY_FIELD_ERROR)
		}

		event.typeLocalId = type?.localId

		CalendarEventService.save(event)
		props.onClose()
	}

	return (
		<DinoDialog
			open={props.open}
			onClose={props.onClose}
			onSave={handleSave}
			header={
				<div
					className='calendar_dialog__header dino__flex_row'
					style={{ backgroundColor: type?.color }}
				>
					<div className='calendar_dialog__header_title'>
						{language.data.ADD_EVENT_TITLE}
					</div>
				</div>
			}
		>
			<div className='calendar_dialog__content'>
				<DinoTextfield
					label={language.data.TITLE}
					value={event.title}
					onChange={e => setEvent({ ...event, title: e.target.value })}
					dataProps={DataConstants.CALENDAR_EVENT_TITLE}
					errorMessage={error}
				/>
				<DinoTextfield
					multiline
					rowsMax={5}
					label={language.data.FORM_DESCRIPTION}
					value={event.description}
					onChange={e => setEvent({ ...event, description: e.target.value })}
					dataProps={DataConstants.CALENDAR_EVENT_DESCRIPTION}
				/>
				<SelectEventType
					value={type}
					onClickOption={handleChangeType}
					eventTypes={props.eventTypes}
				/>
				<SelectDate 
					item={props.item}/>
				<div className='.container-fluid'>
					<div className='row'>
						<div className='col-6 left_block__selector'>
							<SelectTime timeLabel={language.data.EVENT_INIT_TIME_LABEL}
										hour={beginHour}
										minute={beginMinute}/>
						</div>
						<div className='col-6 right_block__selector'>
							<SelectTime timeLabel={language.data.EVENT_END_TIME_LABEL} 
										hour={endTime? endTime[0] : ''}
										minute={endTime? endTime[1] : ''}/>
						</div>
					</div>
				</div>
				<SelectRepeat />
				<SelectNotification />
			</div>
		</DinoDialog>
	)
}