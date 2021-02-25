import APIConfig from '../../environment/api_config.json'

/**
 * @description Valores de URL para conexão com o WebScoket da API.
 * São valores de referência em APIRequestMappingConstants !!!!!!!
 */
class APIWebSocketDestConstants {
	URL = `${APIConfig.URL}websocket/`
	GLOSSARY = 'glossary'
	FAQ_ITEM = 'faq_item'
	TREATMENT = 'treatment'
	TREATMENT_QUESTION = 'treatment_question'
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
