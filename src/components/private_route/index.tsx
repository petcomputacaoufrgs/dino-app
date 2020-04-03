import React, { useContext } from 'react'
import { Route, RouteProps, useLocation, Redirect } from 'react-router'
import { PrivateRouterContext } from '../private_router'

/**
 * @description Gera uma rota com verificação de autenticação e redirecionamento automático
 * @param props Propriedades do Route
 */
const PrivateRoute = (props: RouteProps) : JSX.Element => {

    const routerContext = useContext(PrivateRouterContext)
    
    const location = useLocation()

    return (
        <>
            {routerContext.isAuthenticated() ? 
                <Route {...props}/>
                :
                <Redirect 
                    to={{
                        pathname: routerContext.loginPath, 
                        state: {from: location}}} 
                />
            }
        </>
    )
}

export default PrivateRoute
