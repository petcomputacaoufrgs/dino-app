import React, { useState } from 'react'
import { InputLabel, MenuItem, Select } from '@material-ui/core'
import { useLanguage } from '../../../context/language'
import './styles.css'

const SelectEventType: React.FC = () => {
    const language = useLanguage()
    const EventTypeList = ['Evento', 'Lembrete', 'Medicação']
    const [selectedEventType, setSelectedEventType] = useState('')

    return(
        <div className='event_type__selector'>
            <InputLabel shrink >
                {language.data.EVENT_TYPE_ICON_ALT}
            </InputLabel>
            <Select
                value={selectedEventType}
                onChange={e => setSelectedEventType(e.target.value as string)}
                fullWidth
            >
                {EventTypeList.map((option, index) => (
                    <MenuItem key={index} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </Select>
        </div>
    )
}

export default SelectEventType