import React from 'react'
import { RouteProps, useLocation, Redirect } from 'react-router'
import { useAuth } from '../../../../context/auth'
import AuthenticatedRoute from '..'
import ResponsibleAuthDialog from '../../../responsible_dialog/auth_dialog'

const ResponsibleRoute: React.FC<RouteProps> = props => {
	const auth = useAuth()

	const location = useLocation()

	const showReponsibleAuthDialog = () => {
		return auth.isAuthenticated && auth.isFirstSettingsDone && !auth.isResponsibleAuthenticated 
	}
	
	return (
		<>
			{auth.isKidsMode ? (
				<Redirect
          to={{
            pathname: auth.kidsHomePath,
            state: { from: location },
          }}
        />
			) : (
				<>
					<AuthenticatedRoute {...props} />
					<ResponsibleAuthDialog open={showReponsibleAuthDialog()} />
				</>
			)}
		</>
	)
}

export default ResponsibleRoute