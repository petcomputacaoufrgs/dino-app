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
const AgreementDialog: React.FC<AgreementDialogProps> = ({
  agreeOptionText,
  description,
  disagreeOptionText,
  question,
  onAgree,
  onDisagree,
  open,
}) => {
  const handleDisagree = () => {
    onDisagree()
  }

  const handleAgree = () => {
    if (onAgree) {
      onAgree()
    }
  }

  return (
    <Dialog open={open} onClose={handleDisagree}>
      <DialogTitle id="alert-dialog-title">{question}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDisagree} color="primary">
          {disagreeOptionText}
        </Button>
        {onAgree && (
          <Button onClick={handleAgree} color="primary" autoFocus>
            {agreeOptionText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default AgreementDialog
