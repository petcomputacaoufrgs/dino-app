import React, { useState } from 'react'
import ContactFormDialog from '../add_contact_dialog'
import { Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import './styles.css'
import ContactsConstants from '../../../../constants/ContactsConstants'


const ContactFormDialogButton = () => {

    const [dialogOpen, setDialogOpen] = useState(false)

    const handleOpenDialog = () => {
        setDialogOpen(true)
    }

    const [name, setName] = useState('')
    const [number, setNumber] = useState('')
    const [type, setType] = useState(ContactsConstants.MOBILE)
    const [color, setColor] = useState('')

    return (
        <div>
            <Fab onClick={handleOpenDialog} className="notes__add">
                <AddIcon />
            </Fab>
            <ContactFormDialog
                action="add"
                dialogOpen={dialogOpen}
                setDialogOpen={setDialogOpen}
                name={name}
                setName={setName}
                number={number}
                setNumber={setNumber}
                type={type}
                setType={setType}
                color={color}
                setColor={setColor}
            />
        </div>
    )
}

export default ContactFormDialogButton