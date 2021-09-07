import React, { useState } from 'react'
import DinoDialog from '../../../../components/dialogs/dino_dialog'
import DinoHr from '../../../../components/dino_hr'
import { useLanguage } from '../../../../context/language'
import CardEventProps from './props'
import { ReactComponent as RepeatSVG } from '../../../../assets/icons/general_use/repeat.svg'
import { ReactComponent as AlertSVG } from '../../../../assets/icons/general_use/add_alert.svg'
import OptionsIconButton from '../../../../components/button/icon_button/options_icon_button'
import ItemListMenu from '../../../../components/list_components/item_list_menu'
import './styles.css'

const CardEvent: React.FC<CardEventProps> = (props) => {
    const language = useLanguage()

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

	const handleClickMenu = (
		event: React.MouseEvent<HTMLButtonElement>,
	) => {
		setAnchorEl(event.currentTarget)
	}
	
    return(
		<div>
			<DinoDialog
				open={props.open}
				onClose={props.onClose}
				header={
					<div
						className='calendar_dialog__header'
						style={{backgroundColor: props.item?.color}}
					>
						<div className='dino__flex_row'>
							<div>
								<div className='calendar_dialog__header_title'>
									{props.item?.event.title}
								</div>
								<div className='day_subtitle'>
									{language.data.DAY + ' ' + props.item?.event.date.getDate()}
								</div>
							</div>
							<div>
								<OptionsIconButton onClick={e => handleClickMenu(e)} />
							</div>
						</div>
					</div>
				}
			>
				<div className='calendar_dialog__content'>
					<div className='dino__flex_row time_wrapper'>
						<p>{language.data.DATE_FROM + ': ' + props.item?.event.endTime}</p>
						<p>{language.data.DATE_FROM + ': ' + props.item?.event.endTime}</p>
					</div>
					<DinoHr/>
					<div>

					</div>
					<div className='dino__flex_row'>
						<div className='svg__selector'>
							<RepeatSVG />
						</div>
						<p className='repeat_alert_text'>{language.data.EVENT_REPEAT + ': '}</p>
					</div>
					<div className='dino__flex_row'>
						<div className='svg__selector'>
							<AlertSVG />
						</div>
						<p className='repeat_alert_text'>{language.data.EVENT_ALERT + ': '}</p>
					</div>
				</div>
			</DinoDialog>
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