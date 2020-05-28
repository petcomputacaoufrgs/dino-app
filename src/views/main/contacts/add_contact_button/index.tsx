import React, { useState } from 'react'
import FormDialog from '../add_contact_dialog'
import { Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import './styles.css'


const AddContactButton = () => {

    const [dialogOpen, setDialogOpen] = useState(false)

    const handleOpenDialog = () => {
        setDialogOpen(true)
    }

    return (
        <div>
            <Fab onClick={handleOpenDialog} className="notes__add">
                <AddIcon />
            </Fab>
            <FormDialog
                dialogOpen={dialogOpen}
                setDialogOpen={setDialogOpen}
            />
        </div>
    )
}

export default AddContactButton