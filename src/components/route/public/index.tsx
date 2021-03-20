import React from 'react'
import { useAuth } from '../../../context/auth'
import { Route, RouteProps, useLocation, Redirect } from 'react-router'

const PublicRoute: React.FC<RouteProps> = props => {
	const auth = useAuth()

	const location = useLocation()

	return (
		<>
			{auth && auth.isAuthenticated && auth.isKidsMode ? (
        <Redirect
          to={{
            pathname: auth.kidsHomePath,
            state: { from: location },
          }}
        />
			) : (
				<Route {...props} />
			)}
		</>
	)
}

export default PublicRoute
