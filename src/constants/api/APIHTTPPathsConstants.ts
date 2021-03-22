import APIConfig from '../../environment/api_config.json'
import Path from './APIMainPathsConstants' 

class APIRequestMappingConstants {
	ROOT = APIConfig.URL
	
	GLOSSARY = `${this.ROOT}${Path.GLOSSARY}/`
	FAQ_ITEM = `${this.ROOT}${Path.FAQ_ITEM}/`
	TREATMENT_QUESTION = `${this.ROOT}${Path.TREATMENT_QUESTION}/`
	NOTE = `${this.ROOT}${Path.NOTE}/`
	NOTE_COLUMN = `${this.ROOT}${Path.NOTE_COLUMN}/`
	USER = `${this.ROOT}${Path.USER}/`
	CONTACT = `${this.ROOT}${Path.CONTACT}/`
	ESSENTIAL_CONTACT = `${this.ROOT}${Path.ESSENTIAL_CONTACT}/`
	PHONE = `${this.ROOT}${Path.PHONE}/`
	GOOGLE_CONTACT = `${this.ROOT}${Path.GOOGLE_CONTACT}/`
	TREATMENT = `${this.ROOT}${Path.TREATMENT}/`
	USER_SETTINGS = `${this.ROOT}${Path.USER_SETTINGS}/`
	STAFF = `${this.ROOT}${Path.STAFF}/`

	GOOGLE_SCOPE = `${this.ROOT}auth/google/scope/`
	private AUTH = `${this.ROOT}auth/`
	private PUBLIC_AUTH = `${this.ROOT}public/auth/`
	private APP_SETTINGS = `${this.ROOT}user_app_settings/`
	private LOG_APP_ERROR = `${this.ROOT}log_app_error/`
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
	TEST_CONNECTION = `${this.ROOT}public/test_connection/`
	SAVE_LOG_APP_ERROR = `${this.LOG_APP_ERROR}`
	SAVE_ALL_LOG_APP_ERROR = `${this.LOG_APP_ERROR}all/`
	DELETE_ACCOUNT = `${this.USER}delete_account/`
}

export default new APIRequestMappingConstants()
