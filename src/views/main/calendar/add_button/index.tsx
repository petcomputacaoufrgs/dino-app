import React from 'react'
import { Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import './styles.css'

const AddButton: React.FC = () => {
  return (
    <div className="calendar__add_button">
      <Fab color="primary" aria-label="add">
        <AddIcon />
      </Fab>
    </div>
  )
}

export default AddButton
