import React, { createContext, useContext } from 'react'
import { Router } from 'react-router'
import { History } from 'history'
import PrivateRouterContextType from '../../types/context_provider/PrivateRouterContextType'
import ResponsibleAuthDialog from '../../components/responsible_dialog/auth_dialog'

/**
 * @description Contexto padrão para o router
 */
const PrivateRouterContext = createContext({
	homePath: '',
	loginPath: '',
	isAuthenticated: false,
	isResponsibleAuthenticated: false,
	isFirstSettingsDone: false
} as PrivateRouterContextType)

/**
 * @description Gera os dados necessários para as rotas privadas e de login
 * @param props Propriedades do PrivateRouter
 */
const PrivateRouterProvider: React.FC<PrivateRouterContextType> = props => {
	const getHistory = (): History => {
		if (props.browserHistory) {
			return props.browserHistory
		}

		throw Error('PrivateRouter necessita de um History.')
	}

	const showReponsibleAuthDialog = () => {
		return props.isAuthenticated && props.isFirstSettingsDone && !props.isResponsibleAuthenticated
	}

	return (
		<Router history={getHistory()}>
			<PrivateRouterContext.Provider value={props}>
				{props.children}
			</PrivateRouterContext.Provider>
			<ResponsibleAuthDialog open={showReponsibleAuthDialog()} />
		</Router>
	)
}

export const usePrivateRouter = () => useContext(PrivateRouterContext)

export default PrivateRouterProvider
