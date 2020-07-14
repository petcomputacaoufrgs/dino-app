/**
 * @description Define a base para uma service de sincronização de dados com o servidor.
 * A service deve ser adicionada a service "sync" e será chamada sempre que a conexão com a
 * internet retornar e ao iniciar do aplicativo e deve atualizar a API com dados salvos na
 * aplicação.
 */
export default interface BaseSync {
  sync: () => Promise<boolean>
}
