import LanguageSet from './LanguageSet'

/**
 * @description Conjunto de textos em inglês americano
 */
export default class EN_US implements LanguageSet {

    NOT_FOUND_MESSAGE: string = 'Page not found.'

    NOT_FROND_REDIRECT_MESSAGE: string = 'Redirecting...'
    
    WELCOME_MESSAGE = 'Welcome to DinoAPP!'

    LOGIN_BUTTON_TEXT = 'Log in with Google'

    LOGOUT_BUTTON_DESCRIPTION = 'Image with a open door and a arrow indicating an exit.'

    SEARCH_HOLDER = 'Search...'

    LOADER_ALT = 'Rotating circle image indicating loading.'

    AVATAR_ALT = 'User\'s profile image with rounded edges.'
}