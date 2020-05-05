import React, {useContext} from 'react'
import './styles.css'
import GoogleLoginButton from '../../components/google_login_button'
import Dinosaur1 from '../../images/dinosaur_1.svg'
import Dinosaur2 from '../../images/dinosaur_2.svg'
import { LanguageContext } from '../../provider/language_provider'
import { AlertContext } from '../../provider/alert_provider'

/**
 * @description Tela de login com o Google
 */
const Login = () : JSX.Element => {

    const languageContext = useContext(LanguageContext)

    const language = languageContext.currentLanguage

    const alertProvider = useContext(AlertContext)
 
    const showAlertDinoFail = () => {
        alertProvider.showErrorAlert(language.LOGIN_FAIL_BY_API)
    }

    const showAlertGoogleFail = () => {
        alertProvider.showErrorAlert(language.LOGIN_FAIL_BY_GOOGLE)
    }

    const showAlertRefreshError = () => {
        alertProvider.showInfoAlert(language.LOGIN_REFRESH_NECESSARY)
    }

    const showAlertCancel = () => {
        alertProvider.showInfoAlert(language.LOGIN_CANCELED)
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