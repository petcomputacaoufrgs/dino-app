import React from 'react'
import { ReactComponent as CalendarSVG } from '../../../assets/icons/menu_icons/calendar.svg'
import OptionsIconButton from '../../button/icon_button/options_icon_button'
import './styles.css'

interface CalendarEventTypeItemProps {
    icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>,
    label: string,
    onClickMenu: () => void
}

const CalendarEventTypeItem: React.FC<CalendarEventTypeItemProps> = (props) => {
    const Icon = props.icon

    return (
        <div className='dino__flex_row event_type_item__wrapper'>
            <div className='event_type_item__icon'>
                <Icon />
            </div>
            <div className='event_type_item__name'>
                {props.label}
            </div>
            <OptionsIconButton onClick={props.onClickMenu} />
        </div>
    )
}

export default CalendarEventTypeItem