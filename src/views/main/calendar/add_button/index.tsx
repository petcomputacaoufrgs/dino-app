import React, { useState } from 'react'
import { Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import EditEventModal from '../edit_event_modal'
import { useLanguage } from '../../../../context/language'
import './styles.css'

const AddButton: React.FC = () => {
  const language = useLanguage()

  const [openDialog, setOpenDialog] = useState(false)

  const handleAddClick = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  return (
    <div className="calendar__add_button">
      <Fab
        color="primary"
        aria-label={language.data.ADD_ARIA_LABEL}
        onClick={handleAddClick}
      >
        <AddIcon />
      </Fab>
      <EditEventModal open={openDialog} onClose={handleCloseDialog} />
    </div>
  )
}

export default AddButton
