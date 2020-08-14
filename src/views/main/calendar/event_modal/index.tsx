import React, { useEffect, useState } from 'react'
import EventModalProps from './props'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Header from './header'
import Content from './content'
import './styles.css'

const EventModal: React.FC<EventModalProps> = ({ open, onClose, event }) => {

    const [dialogOpen, setDialogOpen] = useState(open)

    const handleClose = () => {
      onClose()
    }

    const handleDelete = () => {

    }

    const handleEdit = () => {

    }

    useEffect(() => {
      console.log('open')
      setDialogOpen(open)
    }, [open])

    return (
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        className="calendar__event_modal"
        maxWidth="sm"
        style={{ zIndex: 6000 }}
      >
        <DialogActions>
          <Header
            onClose={handleClose}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        </DialogActions>
        <DialogTitle
          id="form-dialog-title"
          className="calendar__event_modal__title"
        >
          <div
            className="calendar__event_modal__title__color"
            style={{ backgroundColor: event.color }}
          />
          {event.name}
        </DialogTitle>
        <DialogContent>
          <Content event={event} />
        </DialogContent>
      </Dialog>
    )
}

export default EventModal