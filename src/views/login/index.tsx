import React, {useContext} from 'react'
import './styles.css'
import LoginButton from '../../components/login_button'
import Dinosaur1 from '../../images/dinosaur_1.svg'
import Dinosaur2 from '../../images/dinosaur_2.svg'
import {LanguageProviderContext} from '../../components/language_provider'
import CustomAlert from '../../components/custom_alert/index';

/**
 * @description Tela de login com o Google
 */
const Login = () : JSX.Element => {

    const languageContext = useContext(LanguageProviderContext)

    const [alertFail, showAlertFail] = CustomAlert('Falha no login.', 'error')
    const [alertCancel, showAlertCancel] = CustomAlert('Você cancelou o login.', 'warning')

    return (
        <div className='login'>
            <img className='login__curious' src={Dinosaur2} alt='Curious dino' />
            <img className='login__logo' src={Dinosaur1} alt='DinoAPP' />
            <p className='login__message'>{ languageContext.WELCOME_MESSAGE }</p>
            <div className='login__button'>
                <LoginButton size='large' onCancel={showAlertCancel} onFail={showAlertFail}  buttonText={languageContext.LOGIN_BUTTON_TEXT} />
            </div>
            {alertFail}
            {alertCancel}
        </div>
    )
}

export default Login