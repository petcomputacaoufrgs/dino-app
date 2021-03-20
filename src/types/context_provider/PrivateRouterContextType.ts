import { History, LocationState } from 'history'

export default interface PrivateRouterContextType<S = LocationState> {
	loginPath: string

	responsibleHomePath: string

	kidsHomePath: string

	isAuthenticated: boolean

	isResponsibleAuthenticated: boolean

	isFirstSettingsDone: boolean

	isKidsMode: boolean

	browserHistory?: History<S>
}
