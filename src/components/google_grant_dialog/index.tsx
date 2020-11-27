import React, { useState } from 'react'
import GoogleGrantDialogProps from './props'
import { Dialog, Button } from '@material-ui/core'
import TransitionSlide from '../slide_transition'
import AuthService from '../../services/auth/AuthService'
import { ReactComponent as DinoAuthSVG } from '../../assets/icons/dino_auth.svg'
import GrantStatusConstants from '../../constants/login/GrantStatusConstants'
import { useAlert } from '../../context/provider/alert'
import { useCurrentLanguage } from '../../context/provider/app_settings'
import './styles.css'

const GoogleGrantDialog = React.forwardRef<JSX.Element, GoogleGrantDialogProps> ((
    {
        scopes,
        title,
        text,
        open,
        onClose,
        onAccept
    },
    ref
) => {
    const alert = useAlert()

    const language = useCurrentLanguage()

    const [refreshNecessary, setRefreshNecessary] = useState(false)

    const handleAcceptClick = async () => {
        const response = await AuthService.requestGoogleGrant(scopes, refreshNecessary)

        setRefreshNecessary(false)
        
        if (response === GrantStatusConstants.SUCCESS) {
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

    const handleCancelClick = async () => {
        onClose()
    }

    return (
        <Dialog
            ref={ref}
            fullWidth
            maxWidth="xs"
            onClose={onClose}
            TransitionComponent={TransitionSlide}
            open={open}
        >
            <div className="google_grant_dialog__header">
                <div className="google_grant_dialog__header__title">
                    <h1>{title}</h1>
                </div>
                <DinoAuthSVG />
            </div>
            <div className="google_grant_dialog__content">
                <p>{text}</p>
            </div>
            <div className="google_grant_dialog__buttons">
                <Button onClick={handleCancelClick}>
                    {language.DIALOG_DECLINE_BUTTON_TEXT}
                </Button>
                <Button autoFocus onClick={handleAcceptClick} className="google_grant_dialog__buttons__accept_button">
                    {language.DIALOG_AGREE_TEXT}
                </Button>
            </div>
        </Dialog>
    )
})

export default GoogleGrantDialog