import React, { useEffect, useState } from 'react'
import AddButton from '../../../components/button/icon_button/add_button'
import DinoDialog from '../../../components/dialogs/dino_dialog'
import { DinoTextfield } from '../../../components/textfield'
import DataConstants from '../../../constants/app_data/DataConstants'
import { useLanguage } from '../../../context/language'
import CalendarService from '../../../services/calendar/CalendarService'
import CalendarEventEntity from '../../../types/calendar/database/CalendarEventEntity'
import StringUtils from '../../../utils/StringUtils'
import SelectEventType from '../../../components/calendar/select_event_type'
import SelectDate from '../../../components/calendar/select_date'
import SelectTime from '../../../components/calendar/select_time'
import MonthNavBar from '../../../components/calendar/month_nav_bar'
import './styles.css'

const getDefaultItem = () => {
	return { title: '' } as CalendarEventEntity
}

const Calendar: React.FC = () => {
	const language = useLanguage()
	const [open, setOpen] = useState(false)
	const [error, setError] = useState<string>()
	const [item, setItem] = useState<CalendarEventEntity>(getDefaultItem())

	const handleSave = async () => {
		if (StringUtils.isEmpty(item.title)) {
			return setError(language.data.EMPTY_FIELD_ERROR)
		}

		CalendarService.save(item)
		setOpen(false)
	}

	useEffect(() => {
		if (open) setItem(getDefaultItem())
	}, [open])

	return (
		<div>
			<MonthNavBar />
			<AddButton label='evento' handleAdd={() => setOpen(true)} />
			<DinoDialog
				open={open}
				onClose={() => setOpen(false)}
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
						value={item.title}
						onChange={e => setItem({ ...item, title: e.target.value })}
						dataProps={DataConstants.CALENDAR_EVENT_TITLE}
						errorMessage={error}
					/>
					<SelectEventType />
					<SelectDate />
					<SelectTime />
					<DinoTextfield
						label={language.data.FORM_DESCRIPTION}
						value={item.description}
						onChange={e => setItem({ ...item, description: e.target.value })}
						dataProps={DataConstants.CALENDAR_EVENT_DESCRIPTION}
					/>
				</div>
			</DinoDialog>
		</div>
	)
}

export default Calendar
