import React, { useState, Fragment } from 'react'
import Button from '../button'
import AuthService from '../../services/AuthService'
import Loader from '../loader';
import PathConstants from '../../constants/PathConstants'
import HistoryService from '../../services/HistoryService';

/**
 * @description Botão básico
 * @param props propriedades possíveis para este botão
 */
const LogoutButton = () => {

    const [loading, setLoading] = useState(false)

    const logout = () => {
        setLoading(true)

        AuthService.logout().then(() => {
            setLoading(false)
            HistoryService.push(PathConstants.LOGIN)
        }).catch(() => setLoading(false))
    }

    return (
        <Fragment>
            <Button onClick={logout}>Sair</Button>
            <Loader loading={loading} />
        </Fragment>
    )
}

export default LogoutButton