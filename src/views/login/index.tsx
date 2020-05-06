import React, {useContext} from 'react'
import GoogleLoginButton from '../../components/google_login_button'
import Dinosaur1 from '../../images/dinosaur_1.svg'
import Dinosaur2 from '../../images/dinosaur_2.svg'
import { AppContext } from '../../provider/app_provider'
import './styles.css'

/**
 * @description Tela de login com o Google
 */
const Login = () : JSX.Element => {

    const appContext = useContext(AppContext)

    const alert = appContext.alert

    const language = appContext.language.currentLanguage
 
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

    return (
        <div className='login'>
            <img className='login__curious' src={Dinosaur2} alt='Curious dino' />
            <img className='login__logo' src={Dinosaur1} alt='DinoAPP' />
            <p className='login__message'>{ language.WELCOME_MESSAGE }</p>
            <div className='login__button'>
                <GoogleLoginButton 
                    size='large' 
                    onCancel={showAlertCancel} 
                    onDinoAPIFail={showAlertDinoFail} 
                    onGoogleFail={showAlertGoogleFail}
                    onRefreshTokenLostError={showAlertRefreshError}
                    buttonText={language.LOGIN_BUTTON_TEXT} />
            </div>
        </div>
    )
}

export default Login