import React from 'react'
import FirstLoginDialogProps from './props'
import './styles.css'
import FaqOptions from '../../faq/faq_options_dialog'

const FirstLoginDialog = ({open, handleClose}: FirstLoginDialogProps) => {

    return (
      <FaqOptions open={open} handleChangeOpenDialog={handleClose} dontAskAgainOption />
      // é pra add mais coisa aqui depois por isso o espaço
    )
}

export default FirstLoginDialog