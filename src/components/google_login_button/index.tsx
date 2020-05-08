import React, { useState } from 'react'
import { useLanguage } from '../../provider/app_provider'
import Button from '../button'
import Loader from '../loader'
import GoogleSecret from '../../config/client_secret.json'
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login'
import GoogleLogo from '../../images/google_logo.png'
import LoginButtonProps from './props'
import LoginErrorConstants from '../../constants/LoginErrorConstants'
import GoogleAuthConstants from '../../constants/GoogleAuthConstants'
import HistoryService from '../../services/history/HistoryService'
import PathConstants from '../../constants/PathConstants'
import AuthService from '../../services/auth/AuthService'
import './styles.css'
import UpdaterService from '../../services/updater/UpdaterService'
import { Typography } from '@material-ui/core'

const GoogleLoginButton = (props: LoginButtonProps) => {
  const language = useLanguage().currentLanguage

  const [loading, setLoading] = useState(false)

  const responseGoogle = async (
    response: GoogleLoginResponse | GoogleLoginResponseOffline,
  ) => {
    setLoading(true)

    const authResponse = await AuthService.google_login(
      response as GoogleLoginResponseOffline,
    )

    if (authResponse === LoginErrorConstants.SUCCESS) {
      const refreshTokenRequired = AuthService.isRefreshRequired()

      if (refreshTokenRequired) {
        AuthService.setRefreshRequiredToFalse()
      } else {
        UpdaterService.checkUpdates()
      }

      setLoading(false)
      HistoryService.push(PathConstants.HOME)

      return
    }

    if (authResponse === LoginErrorConstants.UNKNOW_API_ERROR) {
      props.onDinoAPIFail && props.onDinoAPIFail()
    } else if (authResponse === LoginErrorConstants.EXTERNAL_SERVICE_ERROR) {
      props.onGoogleFail && props.onGoogleFail()
    } else if (
      authResponse === LoginErrorConstants.REFRESH_TOKEN_REFRESH_NECESSARY
    ) {
      AuthService.setRefreshRequiredToTrue()
      props.onRefreshTokenLostError && props.onRefreshTokenLostError()
    }

    setLoading(false)
  }

  const loginFail = (
    response: GoogleLoginResponse | GoogleLoginResponseOffline,
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

  return (
    <>
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
            className="login_button__button"
            onClick={renderProps.onClick}
          >
            <Typography component="p">{props.buttonText}</Typography>
          </Button>
        )}
      />
      <Loader alt={language.LOADER_ALT} loading={loading} />
    </>
  )
}

export default GoogleLoginButton
