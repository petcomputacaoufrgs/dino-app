import APIConfig from '../../environment/api_config.json'

class APIWebSocketPathsConstants {
	ROOT = `${APIConfig.URL}private/websocket/`
	LOGOUT_REQUEST = 'logout_request'
}

export default new APIWebSocketPathsConstants()
