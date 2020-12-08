import React, { useState } from 'react'
import './styles.css'
import FaqOptions from '../../faq/faq_options_dialog'
import AuthService from '../../../../services/auth/AuthService'

const FirstLoginDialog = () => {

  const [dialogOpen, setDialogOpen] = useState(AuthService.isFirstLogin() ? 1 : 0)

  const handleCloseFirstLoginDialog = () => {
    setDialogOpen(0)
    //AuthService.removeIsFirstLogin()
  }
  const handleNext = () => {
    setDialogOpen(dialogOpen + 1);
  }

  const handleBack = () => {
    setDialogOpen(dialogOpen - 1);
  }


    return (
      <>
        <FaqOptions 
          open={dialogOpen === 1} 
          handleChangeOpenDialog={handleNext} 
        />
        
      </>
      // é pra add mais coisa aqui depois por isso o espaço
    )
}

export default FirstLoginDialog