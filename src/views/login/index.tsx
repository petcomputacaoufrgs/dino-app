import React from 'react'
import Button from "../../components/button"
import './styles.css'

const Login = () => {
    const login = () => {
        console.log('logado');
    }

    return (
        <div className='login'>
            <Button onClick={login}>Entrar com o Google</Button>
        </div>
    )
}

export default Login