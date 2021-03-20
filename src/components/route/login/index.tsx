import React, { useEffect } from 'react'
import { useAuth } from '../../../context/auth'
import { Route, RouteProps, useLocation } from 'react-router'

const LoginRoute: React.FC<RouteProps> = props => {
	const auth = useAuth()

	const location = useLocation()

	useEffect((): void => {
		const goToHome = () => {
			auth.browserHistory?.push(auth.responsibleHomePath)
		}

		if (auth && auth.isAuthenticated) {
			goToHome()
		}
	}, [auth, location.pathname])

	const renderRoute = (): JSX.Element => {
		if (!auth.isAuthenticated) {
			return <Route {...props} />
		} else {
			return <></>
		}
	}

	return renderRoute()
}

export default LoginRoute
