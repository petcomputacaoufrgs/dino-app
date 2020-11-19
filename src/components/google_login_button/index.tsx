import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../context_provider/app_settings'
import { useAlert } from '../../context_provider/alert'
import Button from '../button'
import Loader from '../loader'
import GoogleLogo from '../../assets/logos/google.png'
import LoginButtonProps from './props'
import LoginErrorConstants from '../../constants/login/LoginErrorConstants'
import AuthService from '../../services/auth/AuthService'
import { Typography } from '@material-ui/core'
import ConnectionService from '../../services/connection/ConnectionService'
import './styles.css'

const GoogleLoginButton = (props: LoginButtonProps) => {
  const languageContext = useLanguage()
  const language = languageContext.current
  const alert = useAlert()
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

  const handleLoginButtonClick = () => {
    setLoading(true)
    AuthService.requestGoogleLogin(googleLoginListener)
  }

  const googleLoginListener = async (result: number) => {
    if (result === LoginErrorConstants.SUCCESS) {
      return
    }

    if (result === LoginErrorConstants.UNKNOW_API_ERROR) {
      props.onDinoAPIFail && props.onDinoAPIFail()
    } else if (result === LoginErrorConstants.EXTERNAL_SERVICE_ERROR) {
      props.onGoogleFail && props.onGoogleFail()
    } else if (result === LoginErrorConstants.REFRESH_TOKEN_REFRESH_NECESSARY) {
      props.onRefreshTokenLostError && props.onRefreshTokenLostError()
    }

    setLoading(false)
  }
  
  const showOfflineMessage = () => {
    alert.showInfoAlert(language.CANT_LOGIN_DISCONNECTED)
  }

  return (
    <Loader loading={loading}>
      <div className="google_login_button">
        <Button
          size={props.size}
          imageSrc={GoogleLogo}
          imageAlt={props.buttonText}
          className="google_login_button__button"
          onClick={isConnected ? handleLoginButtonClick : showOfflineMessage}
          disabled={!isConnected}
        >
          <Typography component="p">{props.buttonText}</Typography>
        </Button>
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