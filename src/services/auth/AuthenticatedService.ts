import AuthService from "./AuthService"

/**
 * Abstract class to perform operations when user logout
 */
export default abstract class AuthenticatedService {
    /**
     * Function called when user logout
     */
    abstract onLogout: () => Promise<void>

    constructor() {
        this.subscribeInAuthService()
    }

    private subscribeInAuthService = () => {
        window.addEventListener('load', () => AuthService.subscribeAuthenticatedService(this))
    }
}