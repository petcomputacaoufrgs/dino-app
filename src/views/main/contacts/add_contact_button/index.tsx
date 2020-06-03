import React, { useState } from 'react'
import ContactFormDialog from '../contact_form_dialog'
import { Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import './styles.css'


const ContactFormDialogButton = () => {

    const [dialogOpen, setDialogOpen] = useState(false)

    const handleOpenDialog = () => {
        setDialogOpen(true)
    }

    return (
        <div>
            <Fab onClick={handleOpenDialog} className="notes__add">
                <AddIcon />
            </Fab>
            <ContactFormDialog
                action="add"
                dialogOpen={dialogOpen}
                setDialogOpen={setDialogOpen}
            />
        </div>
    )
}

export default ContactFormDialogButton