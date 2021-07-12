import React, { useState } from 'react'
import { Fab } from '@material-ui/core'
import { Add } from '@material-ui/icons'
import EditEventModal from '../edit_event_modal'
import { useLanguage } from '../../../../context/language'
import './styles.css'

const CalendarAddButton: React.FC = () => {
	const language = useLanguage()

	const [openDialog, setOpenDialog] = useState(false)

	const handleAddClick = () => {
		setOpenDialog(true)
	}

	const handleCloseDialog = () => {
		setOpenDialog(false)
	}

	return (
		<div className='calendar__add_button'>
			<Fab
				color='primary'
				aria-label={language.data.ADD}
				onClick={handleAddClick}
			>
				<Add />
			</Fab>
			<EditEventModal open={openDialog} onClose={handleCloseDialog} />
		</div>
	)
}

export default CalendarAddButton
