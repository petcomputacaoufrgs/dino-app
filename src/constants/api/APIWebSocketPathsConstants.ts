import APIConfig from '../../environment/api_config.json'

class APIWebSocketPathsConstants {
	ROOT = `${APIConfig.URL}private/websocket/`
	LOGOUT_REQUEST = 'logout_request'
	GLOSSARY = 'glossary'
	FAQ_ITEM = 'faq_item'
	TREATMENT = 'treatment'
	TREATMENT_QUESTION = 'treatment_question'
	CONTACT = 'contact'
	ESSENTIAL_CONTACT = 'essential_contact'
	PHONE = 'phone'
	ESSENTIAL_PHONE = 'essential_phone'
	NOTE = 'note'
	NOTE_COLUMN = 'note_column'
	USER = 'user'
	USER_SETTINGS = 'settings'
	GOOGLE_SCOPE = 'google_scope'
	STAFF = 'staff'
}

export default new APIWebSocketPathsConstants()
