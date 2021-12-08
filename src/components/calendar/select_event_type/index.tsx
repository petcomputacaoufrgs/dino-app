import React, { useState } from 'react'
import { InputLabel, MenuItem, Select } from '@material-ui/core'
import { useLanguage } from '../../../context/language'
import './styles.css'
import EventTypeEntity from '../../../types/calendar/database/EventTypeEntity'
import ArrayUtils from '../../../utils/ArrayUtils'
import { getIcon } from '../../../services/calendar/EventTypeViewService'

const SelectEventType: React.FC<{
	value?: EventTypeEntity
	onClickOption: (index: number) => void
	eventTypes?: EventTypeEntity[]
}> = props => {
	const language = useLanguage()

	const getFirstType = () => {
		if (ArrayUtils.isNotEmpty(props.eventTypes))
			return props.eventTypes![0].localId
	}

	const [selectedTypeLocalId, setSelectedTypeLocalId] = useState(
		props.value?.localId || getFirstType(),
	)

	const renderMenuItem = (option: EventTypeEntity, index: number) => {
		const TypeIconSVG = getIcon(option.icon)

		return (
			<MenuItem
				className='event_type__selector__menu_item'
				key={index}
				value={option.localId}
				onClick={e => props.onClickOption(index)}
			>
				<TypeIconSVG
					className={`event_type__icon small dino_icon__color-${props.value?.color}`}
				/>
				{option.title}
			</MenuItem>
		)
	}

	return (
		<div className='event_type__selector'>
			<InputLabel shrink>{language.data.EVENT_TYPE_ICON_ALT}</InputLabel>
			<Select
				required
				value={selectedTypeLocalId || ''}
				fullWidth
				onChange={e => setSelectedTypeLocalId(e.target.value as number)}
			>
				{props.eventTypes?.map(renderMenuItem)}
			</Select>
		</div>
	)
}

export default SelectEventType
