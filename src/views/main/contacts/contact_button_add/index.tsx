import React from 'react'
import ContactFormDialog from '../contact_dialog_form'
import { Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import './styles.css'
import Contants from '../../../../constants/ContactsConstants'

const ContactFormDialogButton = (props: 
  { dialogOpen : number; 
    setDialogOpen: React.Dispatch<React.SetStateAction<number>> }) : JSX.Element => {
  //o motivo de eu não usar booleanos eh pq o <ContactFormDialog /> tbm é usado ao editar items, e o operadores para abrí-lo são os seus ids (que aqui não existem)

  return (
    <div>
      <Fab onClick={() => props.setDialogOpen(1)} className="contact__add">
        <AddIcon />
      </Fab>
      <ContactFormDialog
        action={Contants.ACTION_ADD}
        dialogOpen={Boolean(props.dialogOpen)}
        setDialogOpen={props.setDialogOpen}
      />
    </div>
  )
}

export default ContactFormDialogButton
