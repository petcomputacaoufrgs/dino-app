import React from 'react'
import FirstLoginDialogProps from './props'
import './styles.css'
import FaqOptions from '../../faq/faq_options_dialog'

const FirstLoginDialog = ({open, onClose}: FirstLoginDialogProps) => {

    return (
      <FaqOptions open={open} handleChangeOpenDialog={onClose} dontAskAgainOption />
      // é pra add mais coisa aqui depois por isso o espaço
    )
}

export default FirstLoginDialog