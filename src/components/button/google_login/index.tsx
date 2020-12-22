import React, { useState, useEffect } from 'react'
import Loader from '../../loader'
import { ReactComponent as GoogleLogoSVG } from '../../../assets/logos/google.svg'
import LoginButtonProps from './props'
import LoginStatusConstants from '../../../constants/login/LoginStatusConstants'
import AuthService from '../../../services/auth/AuthService'
import ConnectionService from '../../../services/connection/ConnectionService'
import { useAlert } from '../../../context/provider/alert'
import TextIconButton from '../icon_text_button'
import { useUserSettings } from '../../../context/provider/user_settings'
import './styles.css'
import { useGoogleOAuth2 } from '../../../context/provider/google_oauth2/index'

const GoogleLoginButton: React.FC<LoginButtonProps> = ({
  onCancel,
  onDinoAPIFail,
  onGoogleFail,
  onRefreshTokenLostError,
  text,
}) => {
  const userSettings = useUserSettings()
  const language = userSettings.service.getLanguage(userSettings)
  const alert = useAlert()
  const googleOAuth2 = useGoogleOAuth2()
  
  const [loading, setLoading] = useState(false)

  const [isConnected, setIsConnected] = useState(
    ConnectionService.isConnected()
  )

  useEffect(() => {
    const updateConnectionState = (connected: boolean) => {
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

    const connected = await ConnectionService.isDinoConnected()

    if (!connected) {
      setLoading(false)
      setIsConnected(false)
      return
    }

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
    <Loader iconClassName="google_login_button__loader" loading={loading || googleOAuth2.loading}>
      <div className="google_login_button">
        <TextIconButton
          ariaLabel={language.GOOGLE_LOGIN_BUTTON_ARIA_LABEL}
          icon={GoogleLogoSVG}
          className={'google_login_button__text_button'}
          onClick={isConnected ? handleLoginButtonClick : showOfflineMessage}
          disabled={!isConnected}
        >
          <p className='google_login_button__text_button__text'>{text}</p>
        </TextIconButton>
        {!isConnected && (
          <p className="google_login_button__error">
            {language.DISCONNECTED}
          </p>
        )}
      </div>
    </Loader>
  )
}

export default GoogleLoginButton
