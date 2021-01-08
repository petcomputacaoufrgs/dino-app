import React from 'react'
import { usePrivateRouter } from '../../context/private_router'
import { Route, RouteProps, useLocation, Redirect } from 'react-router'

/**
 * @description Gera uma rota com verificação de autenticação e redirecionamento automático
 * @param props Propriedades do Route
 */
const PrivateRoute = (props: RouteProps): JSX.Element => {
  const router = usePrivateRouter()

  const location = useLocation()

  return (
    <>
      {router.isAuthenticated ? (
        <Route {...props} />
      ) : (
        <Redirect
          to={{
            pathname: router.loginPath,
            state: { from: location },
          }}
        />
      )}
    </>
  )
}

export default PrivateRoute
