import React, { useState, useEffect } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert, { AlertProps as MuiAlertProps } from '@material-ui/lab/Alert'
import AlertProps from './props'
import './styles.css'

const MaterialAlert = (props: MuiAlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

const Alert = (props: AlertProps): JSX.Element => {
  const [open, setOpen] = useState(true)
  const [alert, setAlert] = useState(props)

  const onClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)

    if (props.onClose) {
      props.onClose()
    }
  }

  useEffect(() => {
    setAlert(props)
    setOpen(true)
  }, [props])

  return (
    <>
      {open && (
        <div className="custom_alert">
          <Snackbar open={open} onClose={onClose}>
            <MaterialAlert onClose={onClose} severity={alert.severity}>
              {alert.message}
            </MaterialAlert>
          </Snackbar>
        </div>
      )}
    </>
  )
}

export default Alert
