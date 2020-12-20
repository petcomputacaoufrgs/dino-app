import React from 'react'
import Button from '../button/text_button'
import AgreementDialogProps from './props'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { useUserSettings } from '../../context/provider/user_settings'
import './styles.css'

const AgreementDialog: React.FC<AgreementDialogProps> = ({
  agreeOptionText,
  description,
  disagreeOptionText,
  question,
  onAgree,
  onDisagree,
  open,
}) => {
  const userSettings = useUserSettings()

  const language = userSettings.service.getLanguage(userSettings)

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
      <DialogTitle className="alert__dialog_title" id="alert-dialog-title">
        {question}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          ariaLabel={language.AGREEMENT_BUTTON_ARIA_LABEL}
          onClick={handleDisagree}
        >
          {disagreeOptionText}
        </Button>
        {onAgree && (
          <Button
            ariaLabel={language.DISAGREEMENT_BUTTON_ARIA_LABEL}
            onClick={handleAgree}
          >
            {agreeOptionText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default AgreementDialog
