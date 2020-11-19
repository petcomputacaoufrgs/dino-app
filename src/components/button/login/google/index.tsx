import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../../../context_provider/app_settings'
import { useAlert } from '../../../../context_provider/alert'
import Button from '../..'
import Loader from '../../../loader'
import GoogleLogo from '../../../../assets/logos/google.png'
import LoginButtonProps from './props'
import LoginStatusConstants from '../../../../constants/login/LoginErrorConstants'
import AuthService from '../../../../services/auth/AuthService'
import { Typography } from '@material-ui/core'
import ConnectionService from '../../../../services/connection/ConnectionService'
import './styles.css'
import { useGoogleAuth2 } from '../../../../context_provider/google_auth2'

const GoogleLoginButton = (props: LoginButtonProps) => {
  const languageContext = useLanguage()
  const language = languageContext.current
  const alert = useAlert()
  const googleAuth2 = useGoogleAuth2()

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
    console.log(googleAuth2)
    const status = await AuthService.requestGoogleLogin(googleAuth2)

    if (status === LoginStatusConstants.SUCCESS) {
      return
    }

    if (status === LoginStatusConstants.UNKNOW_API_ERROR) {
      props.onDinoAPIFail && props.onDinoAPIFail()
    } else if (status === LoginStatusConstants.EXTERNAL_SERVICE_ERROR) {
      props.onGoogleFail && props.onGoogleFail()
    } else if (status === LoginStatusConstants.REFRESH_TOKEN_REFRESH_NECESSARY) {
      props.onRefreshTokenLostError && props.onRefreshTokenLostError()
    } else if (status === LoginStatusConstants.DISCONNECTED) {
      showOfflineMessage()
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
          disabled={!isConnected || googleAuth2 === undefined}
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