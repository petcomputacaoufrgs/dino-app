import React, { createContext, useContext } from 'react'
import { Router } from 'react-router'
import { History } from 'history'
import AuthContextType from '../../types/context_provider/PrivateRouterContextType'

const AuthContext = createContext({
	loginPath: '',
	responsibleHomePath: '',
	kidsHomePath: '',
	isAuthenticated: false,
	isResponsibleAuthenticated: false,
	isFirstSettingsDone: false,
	isKidsMode: false
} as AuthContextType)

const AuthProvider: React.FC<AuthContextType> = props => {
	const getHistory = (): History => {
		if (props.browserHistory) {
			return props.browserHistory
		}

		throw Error('History can not be null.')
	}

	return (
		<Router history={getHistory()}>
			<AuthContext.Provider value={props}>
				{props.children}
			</AuthContext.Provider>
		</Router>
	)
}

export const useAuth = () => useContext(AuthContext)

export default AuthProvider
