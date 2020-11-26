import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../context/provider/app_settings'
import { useAlert } from '../../context/provider/alert'
import Button from '../button'
import Loader from '../loader'
import GoogleSecret from '../../environment/client_secret.json'
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login'
import GoogleLogo from '../../assets/logos/google.png'
import LoginButtonProps from './props'
import LoginErrorConstants from '../../constants/login/LoginErrorConstants'
import GoogleAuthConstants from '../../constants/google/GoogleAuthConstants'
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

  const responseGoogle = async (
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    setLoading(true)

    const authResponse = await AuthService.googleLogin(
      response as GoogleLoginResponseOffline
    )

    if (authResponse === LoginErrorConstants.SUCCESS) {
      return
    }

    if (authResponse === LoginErrorConstants.UNKNOW_API_ERROR) {
      props.onDinoAPIFail && props.onDinoAPIFail()
    } else if (authResponse === LoginErrorConstants.EXTERNAL_SERVICE_ERROR) {
      props.onGoogleFail && props.onGoogleFail()
    } else if (
      authResponse === LoginErrorConstants.REFRESH_TOKEN_REFRESH_NECESSARY
    ) {
      props.onRefreshTokenLostError && props.onRefreshTokenLostError()
    }

    setLoading(false)
  }

  const loginFail = (
    response: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    if (props.onCancel) {
      props.onCancel()
    }

    setLoading(false)
  }

  const getPrompt = (): string => {
    const refreshTokenRequired = AuthService.isRefreshRequired()

    if (refreshTokenRequired) {
      return GoogleAuthConstants.PROMPT_CONSENT
    }

    return ''
  }

  const getHostRootURI = () => {
    return window.location.protocol + '//' + window.location.host
  }

  const showOfflineMessage = () => {
    alert.showInfoAlert(language.CANT_LOGIN_DISCONNECTED)
  }

  return (
    <Loader loading={loading}>
      <div className="google_login_button">
        <GoogleLogin
          clientId={GoogleSecret.web.client_id}
          scope={AuthService.getDefaultScopes()}
          onSuccess={responseGoogle}
          onFailure={loginFail}
          cookiePolicy={'single_host_origin'}
          redirectUri={getHostRootURI()}
          responseType={'code'}
          accessType={'offline'}
          prompt={getPrompt()}
          render={(renderProps) => (
            <Button
              size={props.size}
              imageSrc={GoogleLogo}
              imageAlt={props.buttonText}
              className="google_login_button__button"
              onClick={isConnected ? renderProps.onClick : showOfflineMessage}
              disabled={!isConnected}
            >
              <Typography component="p">{props.buttonText}</Typography>
            </Button>
          )}
        />
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
