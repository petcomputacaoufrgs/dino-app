import React, { useState, Fragment } from 'react'
import Button from '../button'
import AuthService from '../../services/AuthService'
import Loader from '../loader'
import GoogleSecret from '../../config/client_secret.json'
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login'

/**
 * @description Botão para login
 */
const LoginButton = () => {
    
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

    return (
        <Fragment>
            <GoogleLogin
                clientId={GoogleSecret.web.client_id}
                scope={'https://www.googleapis.com/auth/calendar'}
                buttonText="Entrar com o Google"
                onSuccess={responseGoogle}
                onFailure={loginFail}
                cookiePolicy={'single_host_origin'}
                redirectUri={'http://localhost:3000'}
                responseType={'code'}
                accessType={'offline'}
                render={renderProps => (
                    <Button onClick={renderProps.onClick}>Entrar com o Google</Button>
                )}
                />
            <Loader loading={loading} />
        </Fragment>
    )
}

export default LoginButton