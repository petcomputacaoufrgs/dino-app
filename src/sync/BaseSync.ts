export type SyncFunction = () => Promise<void>

export default interface BaseSync {
  /**
   * @description Função única para o processo de sincronização
   */
  sync?: SyncFunction

  /**
   * @description Função para enviar dados de sincronização do App para a API
   */
  send?: SyncFunction

  /**
   * @description Função para buscar dados atualizados da API para o App
   */
  receive?: SyncFunction
}
