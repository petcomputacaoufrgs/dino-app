import React, { useState } from 'react'
import GoogleGrantDialogProps from './props'
import { Dialog, Button } from '@material-ui/core'
import TransitionSlide from '../slide_transition'
import AuthService from '../../services/auth/AuthService'
import GrantStatusConstants from '../../constants/login/GrantStatusConstants'
import { useAlert } from '../../context/provider/alert'
import { DinoDialogContent, DinoDialogHeader } from '../dino_dialog'
import { useUserSettings } from '../../context/provider/user_settings'
import './styles.css'
import { useUser } from '../../context/provider/user'

const GoogleGrantDialog = React.forwardRef<JSX.Element, GoogleGrantDialogProps>(
  ({ scopes, title, text, open, onDecline, onAccept, onClose }, ref) => {
    const alert = useAlert()

    const userSettings = useUserSettings()

    const user = useUser()

    const currentUser = user.service.getUnique(user.data)

    const language = userSettings.service.getLanguage(userSettings)

    const [refreshNecessary, setRefreshNecessary] = useState(false)

    const handleAcceptClick = async () => {
      if (currentUser) {
        const [response] = await AuthService.requestGoogleGrant(
          scopes,
          refreshNecessary,
          currentUser.email
        )
  
        setRefreshNecessary(false)
  
        if (response === GrantStatusConstants.SUCCESS) {
          alert.showSuccessAlert(language.GRANT_FAIL_BY_EXTERNAL_SUCCESS)
          onAccept()
        } else if (response === GrantStatusConstants.EXTERNAL_SERVICE_ERROR) {
          alert.showErrorAlert(language.GRANT_FAIL_BY_EXTERNAL_ERROR)
        } else if (response === GrantStatusConstants.REQUEST_CANCELED) {
          alert.showInfoAlert(language.GRANT_CANCELED)
        } else if (response === GrantStatusConstants.INVALID_ACCOUNT) {
          alert.showInfoAlert(language.GRANT_FAIL_BY_INVALID_ACCOUNT)
        } else if (response === GrantStatusConstants.REFRESH_TOKEN_NECESSARY) {
          setRefreshNecessary(true)
          alert.showInfoAlert(language.GRANT_RESFRESH_TOKEN_NECESSARY)
        } else if (response === GrantStatusConstants.DISCONNECTED) {
          alert.showErrorAlert(language.GRANT_FAIL_BY_DISCONNECTION)
          onClose()
        } else if (response === GrantStatusConstants.UNKNOW_API_ERROR) {
          alert.showErrorAlert(language.GRANT_FAIL_BY_UNKNOW_ERROR)
        }
      }
    }

    const handleDecline = async () => {
      alert.showInfoAlert(language.GRANT_DECLINED)
      onDecline()
    }

    return (
      <Dialog
        className="google_grant_dialog"
        ref={ref}
        fullWidth
        maxWidth="xs"
        onClose={onClose}
        TransitionComponent={TransitionSlide}
        open={open}
        disableBackdropClick
      >
        <DinoDialogHeader>
          <h1>{title}</h1>
        </DinoDialogHeader>
        <DinoDialogContent>
          <p>{text}</p>
        </DinoDialogContent>
        <div className="google_grant_dialog__buttons">
          <Button onClick={handleDecline}>
            {language.DIALOG_DECLINE_BUTTON_TEXT}
          </Button>
          <Button
            autoFocus
            onClick={handleAcceptClick}
            className="google_grant_dialog__buttons__accept_button"
          >
            {language.DIALOG_AGREE_TEXT}
          </Button>
        </div>
      </Dialog>
    )
  }
)

export default GoogleGrantDialog
