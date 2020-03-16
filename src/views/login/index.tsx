import React from 'react'
import GoogleLogin, {GoogleLoginResponse, GoogleLoginResponseOffline} from 'react-google-login'
import Button from '../../components/button'
import GoogleSecret from '../../config/client_secret.json'
import LoginService from '../../services/LoginService'
import './styles.css'

const Login = () => {
    const responseGoogle = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        if ((response as GoogleLoginResponseOffline).code !== undefined) {
            LoginService.login((response as GoogleLoginResponseOffline).code)
            .then(response => console.log(response))
            .catch(() => console.log('login error'))
        } else {
            console.log('login error type')
        }
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
        </div>
    )
}

export default Login