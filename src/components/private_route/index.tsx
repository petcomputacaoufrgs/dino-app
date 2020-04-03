import React, { useEffect, useContext } from 'react'
import { Route, RouteProps, useLocation } from 'react-router'
import { PrivateRouterContext } from '../private_router'

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
        const goToLogin = () => {
            routerContext.browserHistory?.push(routerContext.loginPath)
        }

        if (routerContext) {
            if (!routerContext.isAuthenticated()) {
                goToLogin()
            } 
        } else {
            throw Error('Todo PrivateRoute deve estar dentro de um PrivateRouter!')
        }

    }, [routerContext, location.pathname])

    const renderRoute = (): JSX.Element => {
        if(routerContext.isAuthenticated()) {
            return <Route {...props}/>
        } else {
            return <></>
        }
    }

    return renderRoute()
}

export default PrivateRoute