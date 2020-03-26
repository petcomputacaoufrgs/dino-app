import React from 'react'
import './styles.css'
import LoginButton from '../../components/login_button'


/**
 * @description Tela de login com o Google
 */
const Login = () : JSX.Element => {

    return (
        <div className='login'>
            <LoginButton />
        </div>
    )
}

export default Login