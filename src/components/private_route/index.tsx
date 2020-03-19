import React, { useEffect } from 'react'
import { Route, RouteProps, useLocation } from 'react-router'
import AuthService from '../../services/AuthService'
import PathConstants from '../../constants/PathConstants'
import HistoryService from '../../services/HistoryService'

/**
 * @description Gera uma rota com verificação de autenticação e redirecionamento automático
 * @param props Propriedades do Route
 */
const PrivateRoute = (props: RouteProps) : JSX.Element => {
    
    const location = useLocation()

    /**
     * @description Verifica se o usuário está autenticado
     */
    const isAuthenticated = (): boolean => (
        AuthService.isAuthenticated()
    )

    /**
     * @description Redireciona o usuário não autenticado caso não esteja na tela de autenticação
     */
    useEffect((): void => {
        /**
         * @description Verifica se o Route chamado é o de Login
         */
        const isLoginRoute = () : boolean => (
            location.pathname === PathConstants.LOGIN
        )

        if (!isAuthenticated() && !isLoginRoute()) {
            HistoryService.push(PathConstants.LOGIN)
        } else if (isAuthenticated() && isLoginRoute()) {
            HistoryService.push(PathConstants.MAIN)
        }
        
    }, [location])

    return (
        <Route {...props}/>
    )
}

export default PrivateRoute
