import APIConfig from '../../environment/api_config.json'

class APIHTTPPathsConstants {
	ROOT = APIConfig.URL
	
	GLOSSARY = `${this.ROOT}private/glossary/`
	FAQ_ITEM = `${this.ROOT}private/faq_item/`
	TREATMENT_QUESTION = `${this.ROOT}private/treatment_question/`
	NOTE = `${this.ROOT}user/note/`
	NOTE_COLUMN = `${this.ROOT}user/note_column/`
	USER = `${this.ROOT}private/user/`
	CONTACT = `${this.ROOT}user/contact/`
	ESSENTIAL_CONTACT = `${this.ROOT}private/essential_contact/`
	PHONE = `${this.ROOT}user/phone/`
	ESSENTIAL_PHONE = `${this.ROOT}private/essential_phone/`
	TREATMENT = `${this.ROOT}private/treatment/`
	USER_SETTINGS = `${this.ROOT}private/settings/`
	STAFF = `${this.ROOT}admin/staff/`
	KIDS_SPACE_SETTINGS = `${this.ROOT}kids_space_settings/`

	GOOGLE_SCOPE = `${this.ROOT}private/auth/google/scope/`
	private PRIVATE_AUTH = `${this.ROOT}private/auth/`
	private PUBLIC_AUTH = `${this.ROOT}public/auth/`
	private APP_SETTINGS = `${this.ROOT}user_app_settings/`
	private LOG_APP_ERROR = `${this.ROOT}private/log_app_error/`
	AUTH_GOOGLE = `${this.PUBLIC_AUTH}google/`
	REFRESH_AUTH = `${this.PUBLIC_AUTH}refresh/`
	GRANT_GOOGLE = `${this.PRIVATE_AUTH}google/grant/`
	REFRESH_AUTH_GOOGLE = `${this.PRIVATE_AUTH}google/refresh/`
	WEB_SOCKET_AUTH = `${this.PRIVATE_AUTH}web_socket/`
	LOGOUT = `${this.PRIVATE_AUTH}logout/`
	APP_SETTINGS_VERSION = `${this.APP_SETTINGS}version/`
	APP_SETTINGS_GET = `${this.APP_SETTINGS}`
	APP_SETTINGS_SAVE = `${this.APP_SETTINGS}`
	CONTACT_GOOGLE_DECLINE = `${this.CONTACT}google/decline_contacts/`
	TEST_CONNECTION = `${this.ROOT}public/test_connection/`
	SAVE_LOG_APP_ERROR = `${this.LOG_APP_ERROR}`
	SAVE_ALL_LOG_APP_ERROR = `${this.LOG_APP_ERROR}all/`
	DELETE_ACCOUNT = `${this.USER}delete_account/`

}

export default new APIHTTPPathsConstants()
