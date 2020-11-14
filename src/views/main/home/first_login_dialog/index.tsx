import React, { useState } from 'react'
import { Dialog, DialogContentText,DialogContent,DialogTitle,DialogActions, Button, Checkbox, FormControlLabel } from '@material-ui/core'
import FirstLoginDialogProps from './props'
//import './styles.css'

const FirstLoginDialog = ({open, dialog, dialogId, totalDialogs, handleNextDialog}: FirstLoginDialogProps) => {
    
    const [checked, setChecked] = useState(false)

    const handleChecked = () => setChecked(!checked)

    return (
      <Dialog open={open}>
        <DialogTitle id="alert-dialog-slide-title">{`${dialog.title}`}</DialogTitle>
          <DialogContent dividers>
            <DialogContentText id="alert-dialog-slide-description">
              {dialog.text}
            </DialogContentText>
            <FormControlLabel
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
            <div style={{ marginLeft: "8px", marginRight: "auto"}}>
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