/**
 * @description Base para service de atualização de informações.
 * A service criada apartir desta base deve ser chamada na service "updater".
 * A função "checkUpdates" será chamada sempre que o usuário logar, o aplicativo iniciar
 * e a conexão com a internet retornar e deverá apenas atualizar o aplicativo com dados
 * novos da API.
 */
export default interface BaseUpdater {
  checkUpdates: () => Promise<void>
}
