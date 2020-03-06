import React from 'react'
import GoogleLogin, {GoogleLoginResponse, GoogleLoginResponseOffline, GoogleLogout} from 'react-google-login'
import Button from '../../components/button'
import GoogleSecret from '../../config/client_secret.json'
import LoginService from '../../services/LoginService'
import './styles.css'

const Login = () => {
    const responseGoogle = (response: GoogleLoginResponse | GoogleLoginResponseOffline) => {
        if ((response as GoogleLoginResponse).accessToken !== undefined) {
            LoginService.login((response as GoogleLoginResponse).accessToken)
        } 
    }

    return (
        <div className='login'>
             <GoogleLogin
                clientId={GoogleSecret.web.client_id}
                buttonText="Entrar com o Google"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                cookiePolicy={'single_host_origin'}
                render={renderProps => (
                    <Button onClick={renderProps.onClick}>Entrar com o Google</Button>
                  )}
            />
        </div>
    )
}

export default Login