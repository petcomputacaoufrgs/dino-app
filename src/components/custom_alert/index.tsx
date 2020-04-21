import React, { useState } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'
import './styles.css'

const alertTime = 4000

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const CustomAlert = (message: string, severity: 'success' | 'info' | 'warning' | 'error'): [JSX.Element, () => void] => {

  const [open, setOpen] = useState(false)

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  const render = (): JSX.Element => (
    <div className='custom_alert'>
      <Snackbar open={open} autoHideDuration={alertTime} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  )

  const show = () => {
    setOpen(true)
  }

  return [render(), show]
}

export default CustomAlert