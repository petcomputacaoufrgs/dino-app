import React, { useEffect } from 'react'
import { Route, RouteProps, useHistory, useLocation } from 'react-router'
import AuthService from '../../services/AuthService'
import PathConstants from '../../constants/PathConstants'

/**
 * @description Gera uma rota com verificação de autenticação e redirecionamento automático
 * @param props Propriedades do Route
 */
const PrivateRoute = (props: RouteProps) : JSX.Element => {

    const history = useHistory()
    
    const location = useLocation()

    /**
     * @description Verifica se o usuário está autenticado
     */
    const isAuthenticated = () : boolean => (
        AuthService.isAuthenticated()
    )

    /**
     * @description Redireciona o usuário não autenticado caso não esteja na tela de autenticação
     */
    useEffect(() => {
        /**
         * @description Verifica se o Route chamado é o de Login
         */
        const isLoginRoute = () : boolean => (
            location.pathname === PathConstants.LOGIN
        )

        if (!isAuthenticated() && !isLoginRoute()) {
            history.push(PathConstants.LOGIN)
        }
    }, [history, location])

    return (
        <Route {...props}/>
    )
}

export default PrivateRoute
