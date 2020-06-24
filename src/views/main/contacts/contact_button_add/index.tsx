import React from 'react'
import ContactFormDialog from '../contact_dialog_form'
import { Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import './styles.css'


const ContactFormDialogButton = ( props: {dialogOpen, setDialogOpen}) => {

    //o motivo de eu não usar booleanos eh pq o <ContactFormDialog /> tbm é usado ao editar items, e o operadores para abrí-lo são os seus ids (que aqui não existem)

    return (
        <div>
            <Fab onClick={() => props.setDialogOpen(1)} className="contact__add">
                <AddIcon />
            </Fab>
            <ContactFormDialog
                action="add"
                dialogOpen={Boolean(props.dialogOpen)}
                setDialogOpen={props.setDialogOpen}
            />
        </div>
    )
}

export default ContactFormDialogButton