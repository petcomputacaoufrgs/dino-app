import React, { useState } from 'react'
import Button from '../button'
import AuthService from '../../services/AuthService'
import Loader from '../loader'
import GoogleSecret from '../../config/client_secret.json'
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login'
import GoogleLogo from '../../images/google_logo.png'
import LoginButtonProps from './props'
import './styles.css'

/**
 * @description Botão para login
 */
const LoginButton = (props: LoginButtonProps) => {
    
    const [loading, setLoading] = useState(false)

    /**
     * @description Função chamada após o login do usuário pela biblioteca de Login com o Google
     * @param response Objeto retornado pela biblioteca definidos na sua documentação,
     * para a configuração responseType = 'code'retornará sempre um GoogleLoginResponseOffline
     */
    const responseGoogle = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        setLoading(true)

        /** @todo Tratar erro de login em tela */
        AuthService.login(response as GoogleLoginResponseOffline)
            .catch(() => setLoading(false))
    }

    /**
     * @todo Tratar o erro de falha no Login por parte do Google / usuário
     * @description Função chamada após falha no login do usuário com o Google
     * @param response Objeto retornado pela biblioteca definidos na sua documentação,
     * para a configuração responseType = 'code'retornará sempre um GoogleLoginResponseOffline
     */
    const loginFail = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        console.log('Login Fail')
    }

    const getURI = () => {
        return window.location.protocol + '//' + window.location.host + '/'
    }

    return (
        <>
            <GoogleLogin
                clientId={GoogleSecret.web.client_id}
                scope={'https://www.googleapis.com/auth/calendar'}
                onSuccess={responseGoogle}
                onFailure={loginFail}
                cookiePolicy={'single_host_origin'}
                redirectUri={getURI()}
                responseType={'code'}
                accessType={'offline'}
                render={renderProps => (
                    <Button imageSrc={GoogleLogo} imageAlt={props.buttonText} className='login_button__button' onClick={renderProps.onClick}>{props.buttonText}</Button>
                )}
            />
            <Loader loading={loading} />
        </>
    )
}

export default LoginButton