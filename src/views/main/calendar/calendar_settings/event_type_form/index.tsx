import { InputLabel } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useLanguage } from '../../../../../context/language'
import CalendarEventTypeService from '../../../../../services/calendar/EventTypeService'
import EventTypeEntity from '../../../../../types/calendar/database/EventTypeEntity'
import DinoDialog from '../../../../../components/dialogs/dino_dialog'
import { DinoTextfield } from '../../../../../components/textfield'
import './styles.css'
import { ColorPalette } from '../../../../../components/color_pallete'
import { getAllIcons } from '../../../../../services/calendar/EventTypeViewService'

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
		const colors = ['#2196F3', '#F44336', '#4CAF50', '#E91E63', '#9C27B0']

		const [type, setType] = useState(getItem(props.item))

		const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
			null,
		)

		const handleClickChooseColor = event => {
			setAnchorEl(event.currentTarget)
		}

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
					<InputLabel className='calendar_event_type_form__label'>
						{language.data.EVENT_COLOR_LABEL}
					</InputLabel>
					<ColorPalette
						colors={colors}
						onClick={color => setType({ ...type, color })}
						anchorEl={anchorEl}
						onClose={() => setAnchorEl(null)}
					>
						<div
							className='calendar_event_type_form__color'
							style={{ backgroundColor: type.color }}
							onClick={handleClickChooseColor}
						/>
					</ColorPalette>
					<InputLabel className='calendar_event_type_form__label'>
						{language.data.EVENT_DATE_ICON_ALT}
					</InputLabel>
					<div className='calendar_event_type_form__icon'>
						{getAllIcons().map((iconObj, index) => (
							<iconObj.Icon
								className={
									'event_type__icon' +
									(type.icon === iconObj.name ? ' selected' : '')
								}
								style={{ backgroundColor: type.color }}
								onClick={() => {
									setType({ ...type, icon: iconObj.name })
								}}
								tabIndex={index}
							/>
						))}
					</div>
				</div>
			</DinoDialog>
		)
	}