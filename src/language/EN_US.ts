import LanguageSet from './LanguageSet'
import LanguageCodeConstants from '../constants/LanguageCodeConstants'

/**
 * @description Conjunto de textos em inglês americano
 */
export default class EN_US implements LanguageSet {

    ISO_LANGUAGE_CODE = 'en'

    NAVIGATOR_LANGUAGE_CODE = LanguageCodeConstants.ENGLISH

    LANGUAGE_PORTUGUESE = 'Portuguese'

    LANGUAGE_ENGLISH = 'English'

    NOT_FOUND_MESSAGE = 'Page not found.'

    NOT_FROND_REDIRECT_MESSAGE = 'Redirecting...'
    
    WELCOME_MESSAGE = 'Welcome to DinoAPP!'

    LOGIN_BUTTON_TEXT = 'Log in with Google'

    LOGOUT_BUTTON_DESCRIPTION = 'Image with a open door and a arrow indicating an exit.'

    SEARCH_HOLDER = 'Search...'

    LOADER_ALT = 'Rotating circle image indicating loading.'

    LOGIN_FAIL_BY_GOOGLE = 'Login with Google failed.'

    LOGIN_FAIL_BY_API = 'Login with Dino server failed.'

    LOGIN_CANCELED = 'Login canceled.'

    LOGIN_REFRESH_ERROR = 'Login with error. We need you to authenticate again, please.'

    AVATAR_ALT = 'User\'s profile image with rounded edges.'

    LOGOUT_DIALOG_QUESTION = 'Are you sure you want to log out?'

    LOGOUT_DIALOG_DESCRIPTION = 'If you say \'YES\' all your account data will be removed from this device'

    AGREEMENT_OPTION_TEXT = 'YES'

    DISAGREEMENT_OPTION_TEXT = 'NO'

    MENU_HOME = 'Home'

    MENU_GAMES = 'Games'
    
    MENU_GLOSSARY = 'Glossary'

    MENU_CONTACTS = 'Contacts'

    MENU_SETTINGS = 'Settings'
    
    MENU_LOGOUT = 'Logout'
    
    SETTINGS_TITLE = 'Settings'
    
    SETTINGS_LANGUAGE = 'Choose Language'

    SETTINGS_SAVE = 'Save'
    
    SETTINGS_SAVE_SUCCESS = 'Settings updated.'
    
}