import APIConfig from '../../environment/api_config.json'

class APIRequestMappingConstants {
	URL = APIConfig.URL
	GLOSSARY = `${this.URL}public/glossary/`
	FAQ = `${this.URL}public/faq/`
	FAQ_ITEM = `${this.URL}public/faq_item/`
	FAQ_USER_QUESTION = `${this.URL}faq_user_question/`
	NOTE = `${this.URL}note/`
	NOTE_COLUMN = `${this.URL}note_column/`
	USER = `${this.URL}user/`
	CONTACT = `${this.URL}contact/`
	ESSENTIAL_CONTACT = `${this.URL}public/essential_contact/`
	PHONE = `${this.URL}phone/`
	GOOGLE_CONTACT = `${this.URL}google_contact/`
	TREATMENT = `${this.URL}public/treatment/`
	USER_SETTINGS = `${this.URL}user_settings/`
	GOOGLE_SCOPE = `${this.URL}auth/google/scope/`
	KIDS_SPACE_SETTINGS = `${this.URL}auth/kids_space_settings/`
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
	TREATMENT_ESSENTIAL_CONTACTS = `${this.CONTACT}essential/faq/`
	DELETE_ACCOUNT = `${this.USER}delete_account/`
}

export default new APIRequestMappingConstants()
