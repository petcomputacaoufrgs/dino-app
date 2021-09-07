import React from 'react'
import DinoDialog from '../../../../components/dialogs/dino_dialog'
import { useLanguage } from '../../../../context/language'
import CardEventProps from './props'
import './styles.css'

const CardEvent: React.FC<CardEventProps> = (props) => {
    const language = useLanguage()

    return(
        <DinoDialog
			open={props.open}
			onClose={props.onClose}
			header={
				<div
					className='calendar_dialog__header'
					style={{backgroundColor: props.item?.color}}
				>
					<div className='calendar_dialog__header_title'>
						{props.item?.event.title}
					</div>
					<div className='day_subtitle'>
						{language.data.DAY + ' ' + props.item?.event.date.getDate()}
					</div>
				</div>
			}
		>
			<div className='calendar_dialog__content'>
				<div className='dino__flex_row time_wrapper'>
					<p>{language.data.DATE_FROM + ': ' + props.item?.event.endTime}</p>
					<p>{language.data.DATE_FROM + ': ' + props.item?.event.endTime}</p>
				</div>
			</div>
        </DinoDialog>
    )
}

export default CardEvent