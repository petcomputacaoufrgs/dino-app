import { History, LocationState } from 'history'

export default interface PrivateRouterContextType<S = LocationState> {
	loginPath: string
	responsibleHomePath: string
	kidsHomePath: string
	isResponsibleAuthenticated: boolean
	isFirstSettingsDone: boolean
	isKidsMode: boolean
	userHomePath: string
	staffHomePath: string
	isAuthenticated: boolean
	userPermission?: string
	browserHistory?: History<S>
}
