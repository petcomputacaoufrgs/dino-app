import { History, LocationState } from 'history'

export default interface PrivateRouterProps<S = LocationState> {
  loginPath: string

  homePath: string

  isAuthenticated: () => boolean

  browserHistory?: History<S>
}
