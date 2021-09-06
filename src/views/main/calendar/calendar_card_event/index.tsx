import React from 'react'
import DinoDialog from '../../../../components/dialogs/dino_dialog'
import { useLanguage } from '../../../../context/language'
import CardEventProps from './props'

const CardEvent: React.FC<CardEventProps> = (props) => {
    const language = useLanguage()

    return(
        <DinoDialog
			open={props.open}
			onClose={props.onClose}
			header={
				<div
					className='calendar_dialog__header dino__flex_row'
					style={{backgroundColor: props.item?.color}}
				>
					<div className='calendar_dialog__header_title'>
						{language.data.ADD_EVENT_TITLE}
					</div>
				</div>
			}
		>
        </DinoDialog>
    )
}

export default CardEvent