import React, { useState, useEffect } from 'react'
import Loader from '../../loader'
import { ReactComponent as GoogleLogoSVG } from '../../../assets/logos/google.svg'
import LoginButtonProps from './props'
import LoginStatusConstants from '../../../constants/login/LoginStatusConstants'
import AuthService from '../../../services/auth/AuthService'
import { Typography } from '@material-ui/core'
import ConnectionService from '../../../services/connection/ConnectionService'
import { useCurrentLanguage } from '../../../context/provider/app_settings'
import { useGoogleOAuth2 } from '../../../context/provider/google_oauth2'
import { useAlert } from '../../../context/provider/alert'
import TextIconButton from '../icon_text_button'
import './styles.css'

const GoogleLoginButton: React.FC<LoginButtonProps> = ({
  onCancel,
  onDinoAPIFail,
  onGoogleFail,
  onRefreshTokenLostError,
  text,
}) => {
  const language = useCurrentLanguage()
  const alert = useAlert()
  const googleOAuth2 = useGoogleOAuth2()

  const [loading, setLoading] = useState(false)

  const [isConnected, setIsConnected] = useState(
    ConnectionService.isConnected()
  )

  useEffect(() => {
    const updateConnectionState = (connected) => {
      setIsConnected(connected)
    }

    ConnectionService.addEventListener(updateConnectionState)

    const cleanBeforeUpdate = () => {
      ConnectionService.removeEventListener(updateConnectionState)
    }

    return cleanBeforeUpdate
  })

  const handleLoginButtonClick = async () => {
    setLoading(true)

    const refreshTokenRequired = AuthService.isRefreshRequired()

    const status = await AuthService.requestGoogleLogin(refreshTokenRequired)

    if (status === LoginStatusConstants.SUCCESS) {
      return
    }

    if (status === LoginStatusConstants.REQUEST_CANCELED) {
      onCancel && onCancel()
    } else if (status === LoginStatusConstants.UNKNOW_API_ERROR) {
      onDinoAPIFail && onDinoAPIFail()
    } else if (status === LoginStatusConstants.EXTERNAL_SERVICE_ERROR) {
      onGoogleFail && onGoogleFail()
    } else if (status === LoginStatusConstants.REFRESH_TOKEN_NECESSARY) {
      onRefreshTokenLostError && onRefreshTokenLostError()
    } else if (status === LoginStatusConstants.DISCONNECTED) {
      showOfflineMessage()
    }

    setLoading(false)
  }
  
  const showOfflineMessage = () => {
    alert.showInfoAlert(language.CANT_LOGIN_DISCONNECTED)
  }

  return (
    <Loader className="google_login_button__loader" loading={loading}>
      <div className="google_login_button">
        <TextIconButton
          ariaLabel={language.GOOGLE_LOGIN_BUTTON_ARIA_LABEL}
          text={text}
          icon={GoogleLogoSVG}
          className={'google_login_button__text_button'}
          onClick={isConnected ? handleLoginButtonClick : showOfflineMessage}
          disabled={!isConnected || !googleOAuth2.loaded}
        >
          <Typography component="p">{text}</Typography>
        </TextIconButton>
        {!isConnected && (
          <Typography className="google_login_button__error" component="p">
            {language.DISCONNECTED}
          </Typography>
        )}
      </div>
    </Loader>
  )
}

export default GoogleLoginButton