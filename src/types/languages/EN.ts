import LanguageBase from './LanguageBase'
import LanguageCodeConstants from '../../constants/LanguageCodeConstants'

/**
 * @description Conjunto de textos em inglês americano
 */
export default class EN implements LanguageBase {
  APP_NAME = 'DinoApp'

  CURIOUS_DINO_ALT = 'Curious dino'

  ISO_LANGUAGE_CODE = 'en'

  NAVIGATOR_LANGUAGE_CODE = LanguageCodeConstants.ENGLISH

  LANGUAGE_PORTUGUESE = 'Portuguese'

  LANGUAGE_ENGLISH = 'English'

  NOT_FOUND_MESSAGE = 'Item not found.'

  NOT_FROND_REDIRECT_MESSAGE = 'Redirecting...'

  WELCOME_MESSAGE = 'Welcome to DinoApp!'

  LOGIN_BUTTON_TEXT = 'Log in with Google'

  LOGOUT_BUTTON_DESCRIPTION =
    'Image with a open door and a arrow indicating an exit.'

  SEARCH_HOLDER = 'Search...'

  LOGIN_FAIL_BY_GOOGLE = 'Login with Google failed.'

  LOGIN_FAIL_BY_API = 'Login with DinoApp server failed.'

  LOGIN_CANCELED = 'Login canceled.'

  LOGIN_REFRESH_NECESSARY =
    'Login with error. We need you to authenticate again, please.'

  AVATAR_ALT = "User's profile image with rounded edges."

  LOGOUT_DIALOG_QUESTION = 'Are you sure you want to log out?'

  LOGOUT_DIALOG_DESCRIPTION =
    'If you answer "YES" all your account data will be removed from this device'

  AGREEMENT_OPTION_TEXT = 'YES'

  DISAGREEMENT_OPTION_TEXT = 'NO'

  ADD_OPTION_TEXT = 'ADD'

  CANCEL_OPTION_TEXT = 'CANCEL'

  EDIT_OPTION_TEXT = 'Edit'

  DELETE_OPTION_TEXT = 'Delete'

  MENU_HOME = 'Home'

  MENU_GAMES = 'Games'

  MENU_GLOSSARY = 'Glossary'

  MENU_CONTACTS = 'Contacts'

  MENU_FAQ = 'FAQ'

  MENU_SETTINGS = 'Settings'

  MENU_LOGOUT = 'Logout'

  MENU_CALENDAR = 'Calendar'

  SETTINGS_TITLE = 'Settings'

  SETTINGS_LANGUAGE = 'Choose Language'

  SETTINGS_FAQ = 'Choose F.A.Q'

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

  ANSWER_NOTE_DIALOG_TITLE = 'Answer'

  NOTE_TAG_LABEL = 'Tags'

  DIALOG_SAVE_BUTTON_LABEL = 'Click to save.'

  DIALOG_SAVE_BUTTON_TEXT = 'Save'

  DIALOG_CANCEL_BUTTON_LABEL = 'Click to cancel.'

  DIALOG_CANCEL_BUTTON_TEXT = 'Cancel'

  SEARCH_BUTTON_LABEL = 'Search...'

  ANSWER_DIALOG_LABEL = 'Model for answer a question note'

  FORM_NAME = 'Name'

  FORM_DESCRIPTION = 'Description'

  FORM_TYPE = 'Type'

  FORM_PHONE = 'Phone'

  FORM_QUESTION = 'Question'

  FORM_QUESTION_PLACEHOLDER = 'Question?'

  FORM_QUESTION_TITLE = 'Send us your question!'

  FORM_ADD_PHONE = 'Add Phone'

  NOT_FOUND_QUESTION_FAQ = 'Did not found your question?'

  CONTACTS_ADD_CONTACT = 'New Contact'

  CONTACTS_MOBILE_PHONE = 'Mobile'

  CONTACTS_RESIDENTIAL_PHONE = 'Residential'

  CONTACTS_PUBLIC_SERVICE_PHONE = 'Public Service'

  NO_AVAILABLE_TEXT = 'No Available Text'

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

  LOADING = 'Loading...'

  NO_OPTIONS = 'No options'

  EMPTY_FIELD_ERROR = "Field can't be empty."

  QUESTION_ALREADY_EXISTS_ERROR = 'Question already exists.'

  DISCONNECTED_MESSAGE =
    "You're disconnected of the Internet. Connect again to save local data."

  CONNECTED_MESSAGE = "Now you're connected!"

  SYNC_STARTED = 'Synchronizing data...'

  SYNC_FINISH = 'Sync finished!'

  SYNC_FAIL = "Sync fail. Let's try again..."

  SYNC_CONNECTION_FAIL =
    'Sync connection error. We will try again when internet connection return.'

  CANT_LOGIN_DISCONNECTED = 'Internet connection is necessary to login.'

  DISCONNECTED = 'Disconnected'

  SELECT_FAQ_BUTTON = 'Search FAQ'

  SELECT_TREATMENT = 'Select Treatment'

  SUNDAY_NAME = 'Sunday'

  MONDAY_NAME = 'Monday'

  TUESDAY_NAME = 'Tuesday'

  WEDNESDAY_NAME = 'Webnesday'

  THURSDAY_NAME = 'Thursday'

  FRIDAY_NAME = 'Friday'

  SATURDAY_NAME = 'Saturday'

  NEXT_BUTTON_TEXT = 'Next'

  PREVIOUS_BUTTON_TEXT = 'Previous'

  CLOSE_ARIA_LABEL = 'Close'

  DELETE_ARIA_LABEL = 'Delete'

  EDIT_ARIA_LABEL = 'Edit'

  INVALID_WEEKDAY = 'Invalid weekday.'

  TODAY = 'Today'

  DATE_FROM = 'From'

  DATE_TO = 'To'

  MEDICAL_APPOINTMENT_TYPE = 'Medical appointment'

  MEDICINE_TYPE = 'Medicine'

  INVALID_EVENT_TYPE = 'Invalid event type'

  MINUTES = 'minutes'

  HOURS = 'hours'

  DAYS = 'days'

  AND = 'and'

  BEFORE = 'before'

  MINUTE = 'minute'

  HOUR = 'hour'

  DAY = 'day'

  ADD_EVENT_TITLE = 'New Event'

  EVENT_TYPE_LABEL = 'Event Type'

  EVENT_NAME_LABEL = 'Event Name'

  EVENT_INIT_DATE_LABEL = 'Start day'

  EVENT_INIT_TIME_LABEL = 'Start time'

  EVENT_END_DATE_LABEL = 'End day'

  EVENT_END_TIME_LABEL = 'End time'

  DATE_PICKER_DAY_FORMAT = 'MM/dd/yyyy'

  EVENT_REPEAT_NOT_REPEAT = 'Not repeat'

  EVENT_REPEAT_EVERY_DAY = 'Everyday'

  EVENT_REPEAT_EVERY_WEEK = 'Every week'

  EVENT_REPEAT_EVERY_MONTH = 'Every month'

  EVENT_REPEAT_EVERY_YEAR = 'Every year'

  EVENT_REPEAT_EVERY_CUSTOMIZED = 'Customized'

  EVENT_REPEAT_TYPE_LABEL = 'Event repeat type'

  INVALID_EVENT_REPEAT_TYPE = 'Invalid event repeat'

  EVENT_TITLE_ICON_ALT = 'Choose event title'

  EVENT_TYPE_ICON_ALT = 'Choose event type'

  EVENT_DATE_ICON_ALT = 'Choose event date'

  EVENT_REPEAT_ICON_ALT = 'Choose event repetition'

  EVENT_REPEAT_END_DATE_LABEL = 'Repetition end'

  EVENT_WEEKDAY_SELECT_LABEL = 'Select days:'

  EVENT_ALERT_ALT = 'Add alerts before event'

  EVENT_ADD_ALARM_LABEL = 'Time'

  EVENT_ADD_ALARM_TYPE_LABEL = 'Time measure'

  EVENT_ADD_ALERT = 'Add notification'

  EVENT_INVALID_ALARM_TYPE = 'invalid type'

  EVENT_ALARM_ZERO = 'At the time of the event'

  EVENT_ALARM_DELETE_ALT = 'Click to delete alarm'

  CHANGE_COLOR_ARIA_LABEL = 'Click to select a random color'

  ADD_PHONE_ARIA_LABEL = 'Click to add a new phone number'

  RETURN_ARIA_LABEL = 'Return'

  SEARCH_ARIA_LABEL = 'Search'

  OPEN_MENU_ARIA_LABEL = 'Open menu'

  ADD_ARIA_LABEL = 'Add'

  OPTIONS_ARIA_LABEL = 'Options'

  EVENT_COLOR_LABEL = 'Selected color'

  FAQ_CONNECTION_ERROR = 'Internet connection required'

  MAX = 'Max.'

  ADD_COLUMN_TEXT = '+ Add column'

  COLUMN_ADD_LABEL = 'Add Column'

  COLUMN_EDIT_LABEL = 'Edit Column'

  COLUMN_TITLE_LABEL = "Column's title"

  COLUMN_MIN_LENGTH_ERROR = 'Minimum one character.'

  COLUMN_TITLE_ALREADY_EXISTS_ERROR = 'Title already exists'

  NOTE_COLUMN_DELETE_DIALOG_QUESTION =
    'Are you sure you want to delete this column?'

  NOTE_COLUMN_WITH_NOTES_DELETE_DIALOG_QUESTION = 'This column has notes!'

  NOTE_COLUMN_DELETE_DIALOG_DESC =
    'If you answer "YES" this column will be removed permanently.'

  NOTE_COLUMN_WITH_NOTES_DELETE_DIALOG_DESC =
    'If you remove this column related notes will be deleted too.'

  NOTE_COLUMN_DELETE_DIALOG_AGREE_TEXT = 'YES'

  NOTE_COLUMN_ADD_NOTE_TEXT = 'Add note'

  NOTE_EDIT_DIALOG_EDIT_TITLE = 'Edit note'

  NOTE_EDIT_DIALOG_NEW_NOTE_TITLE = 'New note'

  QUESTION_NOTE_DIALOG_TITLE = 'Question'

  NOTE_INFO_DIALOG_LAST_UPDATE_TITLE = 'Last update:'

  NOTE_INFO_DIALOG_COLUMN_TITLE = 'Column:'
}
