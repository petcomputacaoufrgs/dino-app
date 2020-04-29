import React, { useState } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert, { AlertProps as MuiAlertProps } from '@material-ui/lab/Alert'
import AlertProps from './props'
import './styles.css'

const MaterialAlert = (props: MuiAlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Alert = (props: AlertProps): JSX.Element => {

  const [open, setOpen] = useState(true)

  const onClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  return (
    <div className='custom_alert'>
      <Snackbar open={open} onClose={onClose}>
        <MaterialAlert onClose={onClose} severity={props.severity}>
          {props.message}
        </MaterialAlert>
      </Snackbar>
    </div>
  )
}

export default Alert