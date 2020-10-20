import React from 'react'
import { useLanguage } from '../../context_provider/app_settings'
import { useAlert } from '../../context_provider/alert'
import { Typography } from '@material-ui/core'
import GoogleLoginButton from '../../components/google_login_button'
import Dinosaur1 from '../../assets/logos/dinosaur_1.svg'
import Dinosaur2 from '../../assets/images/dinosaur_2.svg'
import './styles.css'

/**
 * @description Tela de login com o Google
 */
const Login = (): JSX.Element => {
  const alert = useAlert()

  const language = useLanguage().current

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
      <img
        className="login__curious"
        src={Dinosaur2}
        alt={language.CURIOUS_DINO_ALT}
      />
      <img className="login__logo" src={Dinosaur1} alt={language.APP_NAME} />
      <Typography className="login__message" variant="h6" component="p">
        {language.WELCOME_MESSAGE}
      </Typography>
      <div className="login__button">{renderLoginButton()}</div>
    </div>
  )
}

export default Login
