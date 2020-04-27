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

    MENU_SETTINGS = 'Settings'
    
    MENU_LOGOUT = 'Logout'
    
    SETTINGS_TITLE = 'Settings'
    
    SETTINGS_LANGUAGE = 'Choose Language'

    SETTINGS_SAVE = 'Save'
    
    SETTINGS_SAVE_SUCCESS = 'Settings updated.'

    MENU_NOTES = 'Notes'

    NOTES_HEADER_IMAGE_DESC = 'Image with a opened notebook and a hand writing.'
    
    NOTES_ADD_BUTTON = 'Click to add a new note.'

    NOTE_STATE_DONE = 'Note has a answer.'

    NOTE_STATE_NOT_DONE = 'Note has no answers yet.'

    NOTE_SHOW_ANSWER = 'Click to show the answer of this note right below.'

    NOTE_EDIT_ANSWER_BUTTON = 'Click here to edit the answer of this note.'

    NOTE_EDIT_QUESTION_BUTTON = 'Click here to edit the question of this note.'

    NOTE_DELETE_BUTTON = 'Click here to delete this note.'

    QUESTION_NOTE_DIALOG_TITLE = 'Question'

    ANSWER_NOTE_DIALOG_TITLE = 'Answer'

    NOTE_TAG_LABEL = 'Tags'

    NOTE_DIALOG_SAVE_BUTTON_LABEL = 'Click to save.'

    NOTE_DIALOG_SAVE_BUTTON_TEXT = 'Save'
    
    SEARCH_BUTTON_LABEL = 'Search'

    ANSWER_DIALOG_LABEL = 'Model for answer a question note'

    JANUARY = 'January'

    FEBRUARY = 'February'

    MARCH = 'March'

    APRIL = 'April'

    MAY = 'May'

    JUNE = 'June' 

    JULY = 'July'

    AUGUST = 'August'

    SEPTEMBER = 'September'

    OCTOBER = 'October'

    NOVEMBER = 'November'

    DECEMBER = 'December'

    INVALID_MONTH = 'Invalid month'

    STRING_DATE_FORMAT = 'MM DD, YYYY'

    DELETE_NOTE_ALERT_TITLE = 'Are you sure you want to delete this note?'

    DELETE_NOTE_ALERT_TEXT = 'If you agree this note will be deleted permanently.'
}