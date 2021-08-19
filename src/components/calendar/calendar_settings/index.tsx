import React from 'react'
import CalendarEventTypeItem from '../calendar_settings_item'
import { ReactComponent as CalendarSVG } from '../../../assets/icons/menu_icons/calendar.svg'
import { ReactComponent as FAQSVG } from '../../../assets/icons/menu_icons/faq.svg'
import './styles.css'

const CalendarSettings: React.FC = () => {
    const array = [{ icon: CalendarSVG, label: 'Evento' },
    { icon: FAQSVG, label: 'Lembrete' }]

    return (
        <div className='event_type_item_list'>
            {array.map((e, index) =>
                <CalendarEventTypeItem key={index} icon={e.icon} label={e.label} onClickMenu={() => { }} />)}
        </div>
    )
}

export default CalendarSettings