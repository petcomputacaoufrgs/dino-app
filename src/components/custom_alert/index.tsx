import React, { useState } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'
import { makeStyles, Theme } from '@material-ui/core/styles'

const alertTime = 4000

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const CustomAlert = (message: string, severity: 'success' | 'info' | 'warning' | 'error'): [JSX.Element, () => void] => {
  const classes = useStyles()

  const [open, setOpen] = useState(false)

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  const render = (): JSX.Element => (
    <div className={classes.root}>
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

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}))

export default CustomAlert