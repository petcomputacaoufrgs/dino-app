import React, { useEffect, useState } from 'react'
import SelectDate from '../../../../components/calendar/select_date'
import SelectEventType from '../../../../components/calendar/select_event_type'
import SelectTime from '../../../../components/calendar/select_time'
import DinoDialog from '../../../../components/dialogs/dino_dialog'
import { DinoTextfield } from '../../../../components/textfield'
import DataConstants from '../../../../constants/app_data/DataConstants'
import { useLanguage } from '../../../../context/language'
import CalendarEventService from '../../../../services/calendar/CalendarEventService'
import CalendarEventTypeEntity from '../../../../types/calendar/database/CalendarEventTypeEntity'
import { CalendarEventView } from '../../../../types/calendar/view/CalendarView'
import StringUtils from '../../../../utils/StringUtils'
import EventDialogFormProps from './props'

export type EventTypeView = { color?: string; icon?: string; title?: string }

const getEvent = (item?: CalendarEventView) =>
	item?.event || { title: '', description: '', date: '', time: '' }

const getType = (
	item?: CalendarEventView,
	eventTypes?: CalendarEventTypeEntity[],
) => {
	if (item) {
		const eventType = eventTypes?.find(
			t => t.localId === item?.event.typeLocalId,
		)
		console.log(eventTypes, eventType)
		return {
			color: eventType?.color,
			icon: eventType?.icon,
			title: eventType?.title,
		}
	}
	return undefined
}

export const EventDialogForm: React.FC<EventDialogFormProps> = props => {
	const language = useLanguage()

	const [event, setEvent] = useState(getEvent(props.item))
	const [type, setType] = useState<EventTypeView | undefined>(
		getType(props.item, props.eventTypes),
	)
	const [error, setError] = useState<string>()

	const handleChangeType = (index: number) => {
		if (props.eventTypes) {
			const newType = props.eventTypes[index]
			setType(newType)
			event.typeLocalId = newType.localId
			setEvent({ ...event })
		}
	}

	useEffect(() => {
		if (props.open) {
			setEvent(getEvent(props.item))
			setType(getType(props.item, props.eventTypes))
			console.log(getType(props.item, props.eventTypes))
		}
	}, [props.open])

	const handleSave = async () => {
		if (StringUtils.isEmpty(event.title)) {
			return setError(language.data.EMPTY_FIELD_ERROR)
		}

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
				<SelectEventType
					onChangeType={handleChangeType}
					eventTypesView={props.eventTypes}
				/>
				<SelectDate />
				<SelectTime timeLabel={language.data.EVENT_INIT_TIME_LABEL}/>
				<SelectTime timeLabel={language.data.EVENT_END_TIME_LABEL}/>
				<DinoTextfield
					label={language.data.FORM_DESCRIPTION}
					value={event.description}
					onChange={e => setEvent({ ...event, description: e.target.value })}
					dataProps={DataConstants.CALENDAR_EVENT_DESCRIPTION}
				/>
			</div>
		</DinoDialog>
	)
}
