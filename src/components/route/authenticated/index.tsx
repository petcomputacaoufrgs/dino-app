import React from 'react'
import { useAuth } from '../../../context/auth'
import { Route, RouteProps, useLocation, Redirect } from 'react-router'

const AuthenticatedRoute: React.FC<RouteProps> = props => {
	const auth = useAuth()

	const location = useLocation()

	return (
		<>
			{auth.isAuthenticated ? (
				<Route {...props} />
			) : (
				<Redirect
					to={{
						pathname: auth.loginPath,
						state: { from: location },
					}}
				/>
			)}
		</>
	)
}

export default AuthenticatedRoute
