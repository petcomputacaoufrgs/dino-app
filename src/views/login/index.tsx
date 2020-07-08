import React from 'react'
import { useApp } from '../../provider/app_provider'
import { Typography } from '@material-ui/core'
import GoogleLoginButton from '../../components/google_login_button'
import Dinosaur1 from '../../assets/logos/dinosaur_1.svg'
import Dinosaur2 from '../../assets/images/dinosaur_2.svg'
import './styles.css'

/**
 * @description Tela de login com o Google
 */
const Login = (): JSX.Element => {
  const appContext = useApp()

  const alert = appContext.alert

  const language = appContext.language.current

  const showAlertDinoFail = () => {
    alert.showErrorAlert(language.LOGIN_FAIL_BY_API)
  }

  const showAlertGoogleFail = () => {
    alert.showErrorAlert(language.LOGIN_FAIL_BY_GOOGLE)
  }

  const showAlertRefreshError = () => {
    alert.showInfoAlert(language.LOGIN_REFRESH_NECESSARY)
  }

  const showAlertCancel = () => {
    alert.showInfoAlert(language.LOGIN_CANCELED)
  }

  const renderLoginButton = (): JSX.Element => (
    <GoogleLoginButton
      size="large"
      onCancel={showAlertCancel}
      onDinoAPIFail={showAlertDinoFail}
      onGoogleFail={showAlertGoogleFail}
      onRefreshTokenLostError={showAlertRefreshError}
      buttonText={language.LOGIN_BUTTON_TEXT}
    />
  )

  return (
    <div className="login">
      <img className="login__curious" src={Dinosaur2} alt="Curious dino" />
      <img className="login__logo" src={Dinosaur1} alt="DinoAPP" />
      <Typography className="login__message" variant="h6" component="p">
        {language.WELCOME_MESSAGE}
      </Typography>
      <div className="login__button">
        {renderLoginButton()}
      </div>
    </div>
  )
}

export default Login
