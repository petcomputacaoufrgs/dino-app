import React, { useEffect, useState } from 'react'
import SelectDate from '../../../../components/calendar/select_date'
import SelectEventType from '../../../../components/calendar/select_event_type'
import SelectTime from '../../../../components/calendar/select_time'
import DinoDialog from '../../../../components/dialogs/dino_dialog'
import { DinoTextfield } from '../../../../components/textfield'
import DataConstants from '../../../../constants/app_data/DataConstants'
import { useLanguage } from '../../../../context/language'
import CalendarEventService from '../../../../services/calendar/EventService'
import EventTypeEntity from '../../../../types/calendar/database/EventTypeEntity'
import { EventView } from '../../../../types/calendar/view/CalendarView'
import DateUtils from '../../../../utils/DateUtils'
import StringUtils from '../../../../utils/StringUtils'
import EventDialogFormProps from './props'

const getEvent = (item?: EventView) =>
	item?.event || {
		title: '',
		description: '',
		start: new Date(),
		end: DateUtils.addHour(new Date(), 1),
	}

export const getNewEventView = (date: Date): EventView => {
	const event = getEvent()
	event.start = date
	return { event }
}

const getType = (item?: EventView, eventTypes?: EventTypeEntity[]) => {
	if (!eventTypes || eventTypes.length < 1) return undefined

	let response: EventTypeEntity | undefined

	if (item) {
		response = eventTypes?.find(
			t => t.localId === item?.event.typeLocalId, //TODO fazer um map?
		)
	}

	return response || eventTypes[0]
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
			fullScreen
			open={props.open}
			onClose={props.onClose}
			onSave={handleSave}
			header={
				<div
					className={`calendar_dialog__header dino__flex_row dino_icon__color-${type?.color}`}
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
					value={event.start}
					onChange={value => setEvent({ ...event, start: value })}
				/>
				<div className='container_time'>
					<SelectTime
						timeLabel={language.data.EVENT_INIT_TIME_LABEL}
						value={event.start}
						onChange={value => setEvent({ ...event, start: value })}
					/>
					<SelectTime
						timeLabel={language.data.EVENT_END_TIME_LABEL}
						value={event.end}
						minValue={event.start}
						onChange={value => setEvent({ ...event, end: value })}
					/>
				</div>
				{/* <SelectRepeat item={props.item} />
				<SelectNotification item={props.item} /> */}
			</div>
		</DinoDialog>
	)
}
