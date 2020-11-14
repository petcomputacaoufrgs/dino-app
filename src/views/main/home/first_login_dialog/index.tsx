import React, { useState } from 'react'
import { Dialog, DialogContentText,DialogContent,DialogTitle,DialogActions, Button } from '@material-ui/core'
import FirstLoginDialogProps from './props'
import './styles.css'
import DontAskCheckbox from '../../../../components/dont_ask_checkbox'

const FirstLoginDialog = ({open, dialog, dialogId, totalDialogs, handleNextDialog}: FirstLoginDialogProps) => {
    
    const [checked, setChecked] = useState(false)

    return (
      <Dialog className='dialog' open={open}>
        <DialogTitle>{`${dialog.title}`}</DialogTitle>
          <DialogContent dividers className='dialog__content'>
            <DialogContentText className='dialog__content__text'>
              {dialog.text}
            </DialogContentText>
            <DontAskCheckbox 
              checked={checked} 
              handleChecked={() => setChecked(!checked)}/>
          </DialogContent>
          <DialogActions>
            <div className='dialog__number-of-total'>
              {`${dialogId}/${totalDialogs}`}
            </div>
            <Button onClick={handleNextDialog} color="primary">
              Agree
            </Button>
            <Button onClick={handleNextDialog} color="primary">
              Disagree
            </Button>
          </DialogActions>
      </Dialog>
  )
}

export default FirstLoginDialog