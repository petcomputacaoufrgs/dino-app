import React, { useEffect, useState } from 'react'
import SelectDate from '../../../../components/calendar/select_date'
import SelectEventType from '../../../../components/calendar/select_event_type'
import SelectTime from '../../../../components/calendar/select_time'
import DinoDialog from '../../../../components/dialogs/dino_dialog'
import { DinoTextfield } from '../../../../components/textfield'
import DataConstants from '../../../../constants/app_data/DataConstants'
import { useLanguage } from '../../../../context/language'
import CalendarEventService from '../../../../services/calendar/CalendarEventService'
import CalendarEventEntity from '../../../../types/calendar/database/CalendarEventEntity'
import StringUtils from '../../../../utils/StringUtils'
import EventDialogFormProps from './props'

const getEvent = (item?: CalendarEventEntity) =>
	item || { title: '', description: '', date: '', time: '' }

export const EventDialogForm: React.FC<EventDialogFormProps> = props => {
	const language = useLanguage()

	const [event, setEvent] = useState(getEvent())
	const [error, setError] = useState<string>()

	useEffect(() => {
		if (props.open) setEvent(getEvent())
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
				<div className='calendar_dialog__header dino__flex_row'>
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
				<SelectEventType />
				<SelectDate />
				<SelectTime />
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
