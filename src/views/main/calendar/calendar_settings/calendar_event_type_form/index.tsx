import { InputLabel } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import ColorConstants from '../../../../../constants/app/ColorConstants'
import { useLanguage } from '../../../../../context/language'
import CalendarEventTypeService from '../../../../../services/calendar/EventTypeService'
import EventTypeEntity from '../../../../../types/calendar/database/EventTypeEntity'
import DinoDialog from '../../../../../components/dialogs/dino_dialog'
import { DinoTextfield } from '../../../../../components/textfield'
import './styles.css'

interface CalendarEventTypeFormProps {
	open: boolean
	onClose: () => void
	item?: EventTypeEntity
}

const getItem = (item?: EventTypeEntity) =>
	item || ({ title: '' } as EventTypeEntity)

export const CalendarEventTypeForm: React.FC<CalendarEventTypeFormProps> =
	props => {
		const language = useLanguage()

		const [type, setType] = useState(getItem(props.item))

		useEffect(() => {
			if (props.open) {
				setType(getItem(props.item))
			}
		}, [props.open])

		const handleSave = () => {
			CalendarEventTypeService.save(type)
			props.onClose()
		}

		return (
			<DinoDialog open={props.open} onClose={props.onClose} onSave={handleSave}>
				<div className='calendar_event_type_form__content'>
					<DinoTextfield
						label={language.data.TITLE}
						value={type.title}
						onChange={e => setType({ ...type, title: e.target.value })}
					/>
					<InputLabel className='calendar_event_type_form__color_label'>
						{language.data.EVENT_COLOR_LABEL}
					</InputLabel>
					<div
						className='calendar_event_type_form__color'
						style={{ backgroundColor: type.color }}
					/>
				</div>
			</DinoDialog>
		)
	}
