import React, { useState, Fragment } from 'react'
import Button from '../button'
import AuthService from '../../services/GoogleAuthService'
import Loader from '../loader'

/**
 * @description Botão para logout
 */
const LogoutButton = () => {

    const [loading, setLoading] = useState(false)

    const logout = () => {
        setLoading(true)

        AuthService.logout()
    }

    return (
        <Fragment>
            <Button onClick={logout}>Sair</Button>
            <Loader loading={loading} />
        </Fragment>
    )
}

export default LogoutButton