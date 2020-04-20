import React, {useContext} from 'react'
import './styles.css'
import GoogleLoginButton from '../../components/google_login_button'
import Dinosaur1 from '../../images/dinosaur_1.svg'
import Dinosaur2 from '../../images/dinosaur_2.svg'
import {LanguageContext} from '../../components/language_provider'
import CustomAlert from '../../components/custom_alert/index';

/**
 * @description Tela de login com o Google
 */
const Login = () : JSX.Element => {

    const languageProvider = useContext(LanguageContext)

    const language = languageProvider.currentLanguage

    const [alertDinoFail, showAlertDinoFail] = CustomAlert(language.LOGIN_FAIL_BY_API, 'error')
    const [alertGoogleFail, showAlertGoogleFail] = CustomAlert(language.LOGIN_FAIL_BY_GOOGLE, 'error')
    const [alertRefreshError, showAlertRefreshError] = CustomAlert(language.LOGIN_REFRESH_ERROR, 'warning')
    const [alertCancel, showAlertCancel] = CustomAlert(language.LOGIN_CANCELED, 'warning')
 
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
            {alertDinoFail}
            {alertGoogleFail}
            {alertRefreshError}
            {alertCancel}
        </div>
    )
}

export default Login