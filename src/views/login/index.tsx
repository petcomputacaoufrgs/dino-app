import React from 'react'
import GoogleLogin from 'react-google-login'
import Button from '../../components/button'
import GoogleSecret from '../../config/client_secret.json'
import './styles.css'

const Login = () => {
    const responseGoogle = (response: any) => {
        console.log(response.tokenId);
        alert(response.tokenId)
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