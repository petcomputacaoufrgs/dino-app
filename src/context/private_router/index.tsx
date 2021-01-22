import React, { createContext, useContext } from 'react'
import { Router } from 'react-router'
import { History } from 'history'
import PrivateRouterContextType from '../../types/context_provider/PrivateRouterContextType'

/**
 * @description Contexto padrão para o router
 */
const PrivateRouterContext = createContext({
	userHomePath: '',
	staffHomePath: '',
	loginPath: '',
	isAuthenticated: false,
	userPermission: undefined
} as PrivateRouterContextType)

/**
 * @description Gera os dados necessários para as rotas privadas e de login
 * @param props Propriedades do PrivateRouter
 */
const PrivateRouterContextProvider: React.FC<PrivateRouterContextType> = props => {
	const getHistory = (): History => {
		if (props.browserHistory) {
			return props.browserHistory
		}

		throw Error('PrivateRouter necessita de um History.')
	}

	return (
		<Router history={getHistory()}>
			<PrivateRouterContext.Provider value={props}>
				{props.children}
			</PrivateRouterContext.Provider>
		</Router>
	)
}

export const usePrivateRouter = () => useContext(PrivateRouterContext)

export default PrivateRouterContextProvider
