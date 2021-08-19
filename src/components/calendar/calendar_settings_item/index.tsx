import React from 'react'
import { ReactComponent as CalendarSVG } from '../../../assets/icons/menu_icons/calendar.svg'
import { ReactComponent as FAQSVG } from '../../../assets/icons/menu_icons/faq.svg'
import OptionsIconButton from '../../button/icon_button/options_icon_button'
import './styles.css'
import {
	ListItem,
	ListItemText,
	ListItemAvatar,
	ListItemSecondaryAction,
} from '@material-ui/core'
import { CalendarEventTypeItemProps } from './props'

const CalendarEventTypeItem: React.FC<CalendarEventTypeItemProps> = ({
	item,
	onClick,
	onClickMenu,
}) => {
	const getIcon = () => {
		let Icon = <></>
		if (item.icon) {
			const icons = {
				faq: <FAQSVG />,
				calendar: <CalendarSVG />,
			}
			Icon = icons[item.icon] || <></>
		}
		return Icon
	}

	return (
		<div className='event_type__list__item'>
			<ListItem
				button
				onClick={() => onClick(item)}
				className='event_type__list__item'
			>
				<ListItemAvatar>
					<div
						className='event_type_item__icon'
						style={{ backgroundColor: item.color }}
					>
						{getIcon()}
					</div>
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
