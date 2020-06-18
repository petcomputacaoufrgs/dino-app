import React, { useState } from 'react'
import ContactFormDialog from '../contact_form_dialog'
import { Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import './styles.css'


const ContactFormDialogButton = () => {

    //o motivo de eu não usar booleanos eh pq o <ContactFormDialog /> tbm é usado ao editar items, e o operadores para abrí-lo são os seus ids (que aqui não existem)
    const [dialogOpen, setDialogOpen] = useState(0)

    return (
        <div>
            <Fab onClick={() => setDialogOpen(1)} className="contact__add">
                <AddIcon />
            </Fab>
            <ContactFormDialog
                action="add"
                dialogOpen={Boolean(dialogOpen)}
                setDialogOpen={setDialogOpen}
            />
        </div>
    )
}

export default ContactFormDialogButton