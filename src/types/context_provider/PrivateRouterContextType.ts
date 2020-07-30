import { History, LocationState } from 'history'

export default interface PrivateRouterContextType<S = LocationState> {
  loginPath: string

  homePath: string

  isAuthenticated: () => boolean

  browserHistory?: History<S>
}
