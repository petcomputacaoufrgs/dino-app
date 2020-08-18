import React, { useState } from 'react'
import { Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import AddModal from './add_modal'
import './styles.css'

const AddButton: React.FC = () => {
  const [openDialog, setOpenDialog] = useState(false)

  const handleAddClick = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  return (
    <div className="calendar__add_button">
      <Fab color="primary" aria-label="add" onClick={handleAddClick}>
        <AddIcon />
      </Fab>
      <AddModal open={openDialog} onClose={handleCloseDialog} />
    </div>
  )
}

export default AddButton
