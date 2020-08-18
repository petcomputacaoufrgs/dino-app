import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogActions,
  DialogContent,
} from '@material-ui/core'
import Header from './header'
import AddModalProps from './props'
import Form from './form'
import './styles.css'

const AddModal: React.FC<AddModalProps> = ({ open, onClose }) => {

    const [dialogOpen, setDialogOpen] = useState(open)

    const handleClose = () => {
        onClose()
    }

    useEffect(() => {
      setDialogOpen(open)
    }, [open, setDialogOpen])

    return (
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        className="calendar__add_modal"
        maxWidth="sm"
        style={{ zIndex: 1100 }}
      >
        <DialogActions>
          <Header
            onClose={handleClose}
          />
        </DialogActions>
        <DialogContent>
          <Form />
        </DialogContent>
      </Dialog>
    )        
}

export default AddModal