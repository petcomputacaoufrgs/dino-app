import DinoAPIURLConstants from "./DinoAPIURLConstants"

/**
 * @description Valores de URL para conexão com o WebScoket da API
 */
class DinoAPIWebSocketConstants {
    URL = `${DinoAPIURLConstants.URL}websocket/`
    GLOSSARY = `/topic/glossary`
}

export default new DinoAPIWebSocketConstants()