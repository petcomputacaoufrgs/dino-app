import { History, LocationState } from 'history'

export default interface PrivateRouterContextType<S = LocationState> {
	loginPath: string

	userHomePath: string
	
	staffHomePath: string

	isAuthenticated: boolean

	userPermission?: number

	browserHistory?: History<S>
}
