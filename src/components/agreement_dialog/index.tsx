import React from 'react'
import Button from '@material-ui/core/Button'
import AgreementDialogProps from './props'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

/**
 * Dialog genérica com duas opções
 * @param props Propriedades para especializar a Dialog
 */
const AgreementDialog = (
  props: AgreementDialogProps
): [() => JSX.Element, () => void] => {
  const [open, setOpen] = React.useState(false)

  const onDisagree = () => {
    setOpen(false)
    if (props.onDisagree) {
      props.onDisagree()
    }
  }

  const onAgree = () => {
    setOpen(false)
    if (props.onAgree) {
      props.onAgree()
    }
  }

  const show = () => {
    setOpen(true)
  }

  const render = (): JSX.Element => (
    <Dialog
      open={open}
      onClose={onDisagree}
    >
      <DialogTitle id="alert-dialog-title">{props.question}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {props.description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDisagree} color="primary">
          {props.disagreeOptionText}
        </Button>
        <Button onClick={onAgree} color="primary" autoFocus>
          {props.agreeOptionText}
        </Button>
      </DialogActions>
    </Dialog>
  )

  return [render, show]
}

export default AgreementDialog
