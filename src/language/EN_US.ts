import LanguageSet from './LanguageSet'

/**
 * @description Conjunto de textos em inglês americano
 */
export default class EN_US implements LanguageSet {

    NOT_FOUND_MESSAGE: string = 'Page not found.'

    NOT_FROND_REDIRECT_MESSAGE: string = 'Redirecting...'
    
    WELCOME_MESSAGE = 'Welcome to DinoAPP!'

    LOGIN_BUTTON_TEXT = 'Log in with Google'

    LOGIN_FAIL_BY_GOOGLE = 'Login with Google failed.'

    LOGIN_FAIL_BY_API = 'Login with Dino server failed.'

    LOGIN_CANCELED = 'Login canceled.'
    
}