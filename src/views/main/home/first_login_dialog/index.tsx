import React, { useState } from 'react'
import { Dialog, DialogContentText,DialogContent,DialogTitle,DialogActions, Button, Checkbox, FormControlLabel } from '@material-ui/core'
import FirstLoginDialogProps from './props'
import './styles.css'

const FirstLoginDialog = ({open, dialog, dialogId, totalDialogs, handleNextDialog}: FirstLoginDialogProps) => {
    
    const [checked, setChecked] = useState(false)

    const handleChecked = () => setChecked(!checked)

    return (
      <Dialog className='dialog' open={open}>
        <DialogTitle>{`${dialog.title}`}</DialogTitle>
          <DialogContent dividers className='dialog__content'>
            <DialogContentText className='dialog__content__text'>
              {dialog.text}
            </DialogContentText>
            <FormControlLabel
                  className='dialog__content__checkbox'
                  control={
                    <Checkbox
                    checked={checked}
                    onChange={handleChecked}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                    />}
                    label="Não me pergunte novamente"
                    labelPlacement="end"
                    />
            <br />
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