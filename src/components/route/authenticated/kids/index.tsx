import React from 'react'
import { RouteProps, useLocation, Redirect } from 'react-router'
import { useAuth } from '../../../../context/auth'
import AuthenticatedRoute from '..'

const KidsRoute: React.FC<RouteProps> = props => {
	const auth = useAuth()

	const location = useLocation()

	return (
		<>
			{auth.isKidsMode ? (
				<AuthenticatedRoute {...props} />
			) : (
        <Redirect
          to={{
            pathname: auth.responsibleHomePath,
            state: { from: location },
          }}
        />
			)}
		</>
	)
}

export default KidsRoute