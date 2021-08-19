import React, { useState } from 'react'
import { InputLabel, MenuItem, Select } from '@material-ui/core'
import { useLanguage } from '../../../context/language'
import './styles.css'
import CalendarEventTypeEntity from '../../../types/calendar/database/CalendarEventTypeEntity'
import { EventTypeView } from '../../../views/main/calendar/event_dialog_form'

const SelectEventType: React.FC<{
	eventTypesView?: EventTypeView[]
	onChangeType: (index: number) => void
}> = props => {
	const language = useLanguage()

	const [type, setType] = useState<string>()

	return (
		<div className='event_type__selector'>
			<InputLabel shrink>{language.data.EVENT_TYPE_ICON_ALT}</InputLabel>
			<Select
				fullWidth
				value={type}
				onChange={e => setType(e.target.value as string)}
			>
				{props.eventTypesView?.map((option, index) => (
					<MenuItem
						key={index}
						value={option.color}
						onClick={e => props.onChangeType(index)}
					>
						{option.title}
					</MenuItem>
				))}
			</Select>
		</div>
	)
}

export default SelectEventType
