import React, { useState } from 'react'
import GoogleLogin, {GoogleLoginResponse, GoogleLoginResponseOffline} from 'react-google-login'
import Button from '../../components/button'
import Loader from '../../components/loader/'
import GoogleSecret from '../../config/client_secret.json'
import AuthService from '../../services/AuthService'
import './styles.css'


/**
 * @description Tela de login com o Google
 */
const Login = () : JSX.Element => {

    const [loading, setLoading] = useState(false)

    /**
     * @description Função chamada após o login do usuário pela biblioteca de Login com o Google
     * @param response Objeto retornado pela biblioteca definidos na sua documentação, 
     * para a configuração responseType = 'code'retornará sempre um GoogleLoginResponseOffline
     */
    const responseGoogle = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        setLoading(true)

        /** @todo Tratar erro de login em tela */
        AuthService.login(response as GoogleLoginResponseOffline).then( () => {
            setLoading(false)
        }).catch(() => setLoading(false))
    }

    return (
        <div className='login'>
            <GoogleLogin
                clientId={GoogleSecret.web.client_id}
                scope={'https://www.googleapis.com/auth/calendar'}
                buttonText="Entrar com o Google"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
                redirectUri={'http://localhost:3000'}
                responseType={'code'}
                accessType={'offline'}
                render={renderProps => (
                    <Button onClick={renderProps.onClick}>Entrar com o Google</Button>
                  )}
            />
            <Loader loading={loading} />
        </div>
    )
}

export default Login