import { Language } from '@material-ui/icons'
import React, { useEffect, useState } from 'react'
import AddButton from '../../../components/button/icon_button/add_button'
import { ColorPalette } from '../../../components/color_pallete'
import DinoDialog from '../../../components/dialogs/dino_dialog'
import { DinoTextfield } from '../../../components/textfield'
import DataConstants from '../../../constants/app_data/DataConstants'
import { useLanguage } from '../../../context/language'
import CalendarService from '../../../services/calendar/CalendarService'
import CalendarEventEntity from '../../../types/calendar/database/CalendarEventEntity'
import StringUtils from '../../../utils/StringUtils'
import './styles.css'

const getDefaultItem = () => {
	return { title: '' } as CalendarEventEntity
}

const Calendar = () => {
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

	const colors = ['red', 'blue', 'green', 'purple']

	useEffect(() => {
		if (open) setItem(getDefaultItem())
	}, [open])

	return (
		<div>
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
						<ColorPalette colors={colors} onClick={() => {}} />
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
