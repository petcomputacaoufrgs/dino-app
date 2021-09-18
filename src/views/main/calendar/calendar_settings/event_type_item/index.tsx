import React from 'react'
import OptionsIconButton from '../../../../../components/button/icon_button/options_icon_button'
import {
	ListItem,
	ListItemText,
	ListItemAvatar,
	ListItemSecondaryAction,
} from '@material-ui/core'
import { CalendarEventTypeItemProps } from './props'
import './styles.css'
import { getIcon } from '../../../../../services/calendar/EventTypeViewService'

const CalendarEventTypeItem: React.FC<CalendarEventTypeItemProps> = ({
	item,
	onClick,
	onClickMenu,
}) => {
	const TypeIconSVG = getIcon(item.icon)

	return (
		<div className='event_type__list__item'>
			<ListItem
				button
				onClick={() => onClick(item)}
				className='event_type__list__item'
			>
				<ListItemAvatar>
					<TypeIconSVG
						className={`event_type__icon large dino_icon__color-${item.color}`}
					/>
				</ListItemAvatar>
				<ListItemText className='list__item__text' primary={item.title} />
				<ListItemSecondaryAction>
					<OptionsIconButton onClick={e => onClickMenu(e, item)} />
				</ListItemSecondaryAction>
			</ListItem>
		</div>
	)
}

export default CalendarEventTypeItem
