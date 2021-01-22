import React from 'react'
import { usePrivateRouter } from '../../context/private_router'
import { Route, RouteProps, useLocation, Redirect } from 'react-router'

/**
 * @description Gera uma rota com verificação de autenticação e redirecionamento automático
 * @param props Propriedades do Route
 */

interface PrivateRouteProps extends RouteProps {
	restrictedTo?: number[]
}

const PrivateRoute = (props: PrivateRouteProps): JSX.Element => {
	const router = usePrivateRouter()

	const location = useLocation()
	
	const userIsNotAuthorized = () => {
		if(props.restrictedTo !== undefined && props.restrictedTo.length > 0 && router.userPermission) {
			return !props.restrictedTo.includes(router.userPermission)
		} return false
	}


	const renderRedirect = () => {
    console.log("redirectPath")
		return (
			<Redirect
				to={{
					pathname: router.loginPath ,
					state: { from: location },
				}}
			/>
		)
   }

   const render = () => {

      if(router.isAuthenticated) {
         if(userIsNotAuthorized()) {
          return renderRedirect()
         }
      } else return renderRedirect()

      return <Route {...props} />
   }


   return render()

	}



export default PrivateRoute
