import APIConfig from '../../environment/api_config.json'
import Path from './APIWebSocketDestConstants' 

class APIRequestMappingConstants {
	URL = APIConfig.URL
	
	GLOSSARY = `${this.URL}${Path.GLOSSARY}/`
	FAQ_ITEM = `${this.URL}${Path.FAQ_ITEM}/`
	TREATMENT_QUESTION = `${this.URL}${Path.TREATMENT_QUESTION}/`
	NOTE = `${this.URL}${Path.NOTE}/`
	NOTE_COLUMN = `${this.URL}${Path.NOTE_COLUMN}/`
	USER = `${this.URL}${Path.USER}/`
	CONTACT = `${this.URL}${Path.CONTACT}/`
	ESSENTIAL_CONTACT = `${this.URL}${Path.ESSENTIAL_CONTACT}/`
	PHONE = `${this.URL}${Path.PHONE}/`
	GOOGLE_CONTACT = `${this.URL}${Path.GOOGLE_CONTACT}/`
	TREATMENT = `${this.URL}${Path.TREATMENT}/`
	USER_SETTINGS = `${this.URL}${Path.USER_SETTINGS}/`
	STAFF = `${this.URL}${Path.STAFF}/`

	GOOGLE_SCOPE = `${this.URL}auth/google/scope/`
	private AUTH = `${this.URL}auth/`
	private PUBLIC_AUTH = `${this.URL}public/auth/`
	private APP_SETTINGS = `${this.URL}user_app_settings/`
	private LOG_APP_ERROR = `${this.URL}log_app_error/`
	AUTH_GOOGLE = `${this.PUBLIC_AUTH}google/`
	GRANT_GOOGLE = `${this.AUTH}google/grant/`
	REFRESH_AUTH_GOOGLE = `${this.AUTH}google/`
	REFRESH_AUTH = `${this.PUBLIC_AUTH}refresh/`
	WEB_SOCKET_AUTH = `${this.AUTH}web_socket/`
	LOGOUT = `${this.AUTH}logout/`
	APP_SETTINGS_VERSION = `${this.APP_SETTINGS}version/`
	APP_SETTINGS_GET = `${this.APP_SETTINGS}`
	APP_SETTINGS_SAVE = `${this.APP_SETTINGS}`
	CONTACT_GOOGLE_DECLINE = `${this.CONTACT}google/decline_contacts/`
	TEST_CONNECTION = `${this.URL}public/test_connection/`
	SAVE_LOG_APP_ERROR = `${this.LOG_APP_ERROR}`
	SAVE_ALL_LOG_APP_ERROR = `${this.LOG_APP_ERROR}all/`
	DELETE_ACCOUNT = `${this.USER}delete_account/`
}

export default new APIRequestMappingConstants()
