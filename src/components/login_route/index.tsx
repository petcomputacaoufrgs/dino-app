import React, { useEffect, useContext } from 'react'
import { Route, RouteProps, useLocation } from 'react-router'
import { PrivateRouterContext } from '../private_router'

/**
 * @description Gera uma rota de login com verificação de autenticação e redirecionamento automático
 * @param props Propriedades do Route
 */
const LoginRoute = (props: RouteProps) : JSX.Element => {

    const routerContext = useContext(PrivateRouterContext)
    
    const location = useLocation()

    /**
     * @description Verifica se o usuário está autenticado e redireciona para a tela correta caso sim
     */
    useEffect((): void => {    
        const goToHome = () => {
            routerContext.browserHistory?.push(routerContext.homePath)
        }

        if (routerContext) {
            if (routerContext.isAuthenticated()) {
                goToHome()
            } 
        } else {
            throw Error('Todo LoginRoute deve estar dentro de um PrivateRouter.')
        }

    }, [routerContext, location.pathname])

    const renderRoute = (): JSX.Element => {
        if(!routerContext.isAuthenticated()) {
            return <Route {...props}/>
        } else {
            return <></>
        }
    }

    return renderRoute()
}

export default LoginRoute
