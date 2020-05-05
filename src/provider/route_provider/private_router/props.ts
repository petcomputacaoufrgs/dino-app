import { History, LocationState } from 'history'

/**
 * @description Propriedades private router.
 */
export default class PrivateRouterProps<S = LocationState> {

    /**
     * @description Path onde se encontra a tela de login
     */
    loginPath: string

    /**
     * @description Path onde se encontra a tela para redirecionamento pós login
     */
    homePath: string

    /**
     * @description Informa se o usuário não está autenticado
     */
    isAuthenticated: () => boolean

    /**
     * 
     */
    browserHistory?: History<S>

    /**
     * @description Conteúdo filho
     */
    children?: any

    constructor(loginPath: string, homePath: string, isAuthenticated: () => boolean, browserHistory?: History<S>, children?: any) {
        this.loginPath = loginPath
        this.homePath = homePath
        this.isAuthenticated = isAuthenticated
        this.browserHistory = browserHistory
        this.children = children
    }
}