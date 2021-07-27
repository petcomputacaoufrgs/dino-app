import React, { useState } from 'react'
import AddButton from '../../../components/button/icon_button/add_button'
import DinoDialog from '../../../components/dialogs/dino_dialog'
import { DinoTextfield } from '../../../components/textfield'
import DataConstants from '../../../constants/app_data/DataConstants'
import CalendarService from '../../../services/calendar/CalendarService'
import EventEntity from '../../../types/calendar/database/EventEntity'
import StringUtils from '../../../utils/StringUtils'
import './styles.css'

const Calendar = () => {
    const [open, setOpen] = useState(false)
    const [error, setError] = useState<string>()
    const handleSave = () => {
        if (StringUtils.isEmpty(title)) {
            setError('Inválido!!!!!')
            return
        }
        const event: EventEntity = {
            title,
            description
        }

        CalendarService.save(event)
        setOpen(false)
    }
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    return (
        <div>
            <AddButton label='evento' handleAdd={() => setOpen(true)} />
            <DinoDialog open={open} onClose={() => setOpen(false)} onSave={handleSave}
                header={
                    <div
                        className='calendar_dialog__header'>
                        <div className='calendar_dialog__header_title'>Adicionar Evento</div>
                    </div>}
            >
                <div className="calendar_dialog__content">
                    <DinoTextfield
                        label='Título'
                        value={title}
                        onChange={(e) => setTitle(e.target.value as string)}
                        dataProps={DataConstants.CALENDAR_EVENT_TITLE}
                        errorMessage={error}
                    />
                    <DinoTextfield
                        label='Descrição'
                        value={description}
                        onChange={(e) => setDescription(e.target.value as string)}
                        dataProps={DataConstants.CALENDAR_EVENT_DESCRIPTION} />
                </div>
            </DinoDialog>
        </div>
    )
}

export default Calendar