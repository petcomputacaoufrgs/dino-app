import React, { useState } from 'react'
import DinoDialog from '../../../../components/dialogs/dino_dialog'
import DinoHr from '../../../../components/dino_hr'
import { useLanguage } from '../../../../context/language'
import CardEventProps from './props'
import { ReactComponent as RepeatSVG } from '../../../../assets/icons/general_use/repeat.svg'
import { ReactComponent as AlertSVG } from '../../../../assets/icons/general_use/add_alert.svg'
import OptionsIconButton from '../../../../components/button/icon_button/options_icon_button'
import ItemListMenu from '../../../../components/list_components/item_list_menu'
import DateUtils from '../../../../utils/DateUtils'
import './styles.css'
import { CardHeader, Dialog, Typography } from '@material-ui/core'
import TransitionSlide from '../../../../components/slide_transition'

const CardEvent: React.FC<CardEventProps> = props => {
	const language = useLanguage()
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

	const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget)
	}

	const EventSection: React.FC<{ title: string; value: string }> = props => {
		return (
			<div className='event_section dino__flex_row'>
				<div className='svg__selector'>{props.children}</div>
				<Typography
					className='event_section__text'
					variant='subtitle1'
					color='textSecondary'
					component='p'
				>
					{props.title + ': ' + props.value}
				</Typography>
			</div>
		)
	}

	return (
		<div>
			<Dialog
				style={{ padding: 0 }}
				fullWidth
				TransitionComponent={TransitionSlide}
				onBackdropClick={props.onClose}
				open={props.open}
				onClose={props.onClose}
			>
				<CardHeader
					className='calendar_dialog__header'
					style={{ backgroundColor: props.item?.color }}
					action={
						<div className='card_event__icon_button'>
							<OptionsIconButton onClick={e => handleClickMenu(e)} />
						</div>
					}
					title={
						<div className='calendar_dialog__header_title'>
							{props.item.event.title}
						</div>
					}
					subheader={
						<div className='day_subtitle'>
							<div>
								{DateUtils.getExtendedDateStringFormated(
									props.item.event.date,
									language.data,
								)}
							</div>
							<div>
								{DateUtils.getTimeStringFormated(
									props.item.event.date,
									props.item.event.endTime,
								)}
							</div>
						</div>
					}
				></CardHeader>
				<div className='calendar_dialog__content'>
					<EventSection
						title={language.data.EVENT_REPEAT}
						value={
							props.item?.event.repeat || language.data.EVENT_REPEAT_NOT_REPEAT
						}
					>
						<RepeatSVG />
					</EventSection>
					<EventSection
						title={language.data.EVENT_ALERT}
						value={
							props.item?.event.alert || language.data.EVENT_ALERT_NOT_DEFINED
						}
					>
						<AlertSVG />
					</EventSection>
				</div>
			</Dialog>
			<ItemListMenu
				anchor={anchorEl}
				setAnchor={setAnchorEl}
				onEdit={props.onEdit}
				onDelete={props.onDelete}
			/>
		</div>
	)
}

export default CardEvent
