export default interface BaseSync {
  /**
   * @description Função para enviar dados de sincronização do App para a API
   */
  send: () => Promise<void>

  /**
   * @description Função para buscar dados atualizados da API para o App
   */
  receive: () => Promise<void>
}
