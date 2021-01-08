import React from 'react'
import { useAlert } from '../../context/alert'
import Dinosaur1 from '../../assets/logos/dinosaur_1.svg'
import Dinosaur2 from '../../assets/images/dinosaur_2.svg'
import GoogleLoginButton from '../../components/button/google_login'
import { useLanguage } from '../../context/language'
import Loader from '../../components/loader'
import './styles.css'

const Login = (): JSX.Element => {
  const alert = useAlert()

  const language = useLanguage()

  const showAlertDinoFail = () => {
    alert.showErrorAlert(language.data.LOGIN_FAIL_BY_API)
  }

  const showAlertGoogleFail = () => {
    alert.showErrorAlert(language.data.LOGIN_FAIL_BY_GOOGLE)
  }

  const showAlertRefreshError = () => {
    alert.showInfoAlert(language.data.LOGIN_REFRESH_NECESSARY)
  }

  const showAlertCancel = () => {
    alert.showInfoAlert(language.data.LOGIN_CANCELED)
  }

  const renderLoginButton = (): JSX.Element => (
    <GoogleLoginButton
      onCancel={showAlertCancel}
      onDinoAPIFail={showAlertDinoFail}
      onGoogleFail={showAlertGoogleFail}
      onRefreshTokenLostError={showAlertRefreshError}
      text={language.data.LOGIN_BUTTON_TEXT}
    />
  )

  return (
    <Loader isLoading={language.loading}>
      <div className="login">
        <img
          className="login__curious"
          src={Dinosaur2}
          alt={language.data.CURIOUS_DINO_ALT}
        />
        <img className="login__logo" src={Dinosaur1} alt={language.data.APP_NAME} />
        <h1 className="login__message">{language.data.WELCOME_MESSAGE}</h1>
        <div className="login__button">{renderLoginButton()}</div>
      </div>
    </Loader>
  )
}

export default Login
