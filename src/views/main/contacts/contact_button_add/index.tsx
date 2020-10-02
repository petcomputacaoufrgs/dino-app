import React from 'react'
import ContactFormDialog from '../contact_dialog_form'
import { Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import './styles.css'
import Contants from '../../../../constants/contact/ContactsConstants'

const ContactFormDialogButton = (props: {
  dialogOpen: number
  setDialogOpen: React.Dispatch<React.SetStateAction<number>>
}): JSX.Element => {
  
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
