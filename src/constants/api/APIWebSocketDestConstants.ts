import APIRequestMappingConstants from './APIRequestMappingConstants'

/**
 * @description Valores de URL para conexão com o WebScoket da API
 */
class APIWebSocketDestConstants {
	URL = `${APIRequestMappingConstants.URL}websocket/`
	GLOSSARY = 'glossary'
	FAQ = 'faq'
	FAQ_ITEM = 'faq_item'
	TREATMENT = 'treatment'
	FAQ_USER_QUESTION = 'faq_user_question'
	CONTACT = 'contact'
	ESSENTIAL_CONTACT = 'essential_contact'
	PHONE = 'phone'
	GOOGLE_CONTACT = 'google_contact'
	NOTE = 'note'
	NOTE_COLUMN = 'note_column'
	USER = 'user'
	USER_SETTINGS = 'user_settings'
	GOOGLE_SCOPE = 'google_scope'
	LOGOUT_REQUEST = 'logout_request'
	STAFF = 'staff'
}

export default new APIWebSocketDestConstants()
