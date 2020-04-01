import React, { useEffect, useContext } from 'react'
import { Route, RouteProps, useLocation } from 'react-router';
import { PrivateRouterContext } from '../private_router'
import HistoryService from '../../services/HistoryService';

/**
 * @description Gera uma rota com verificação de autenticação e redirecionamento automático
 * @param props Propriedades do Route
 */
const PrivateRoute = (props: RouteProps) : JSX.Element => {

    const routerContext = useContext(PrivateRouterContext)

    const location = useLocation()

    /**
     * @description Redireciona o usuário não autenticado caso não esteja na tela de autenticação
     */
    useEffect((): void => {
        const isLoginView = () => {
            return routerContext.loginPath === location.pathname
        }
    
        const goToHome = () => {
            HistoryService.push(routerContext.homePath)
        }
    
        const goToLogin = () => {
            HistoryService.push(routerContext.loginPath)
        }

        if (routerContext) {
            if (routerContext.isAuthenticated) {
                if (isLoginView()) {
                    goToHome()
                }
            } else {
                if (!isLoginView()) {
                    goToLogin()
                }
            } 
        } else {
            throw Error('Todo PrivateRoute deve estar dentro de um PrivateRouter!')
        }

    }, [routerContext, location.pathname])

    return (
        <Route {...props}/>
    )
}

export default PrivateRoute
