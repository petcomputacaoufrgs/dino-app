/**
 * @description Serviço utilizado para atualizar dados de contexto
 * quando os dados locais forem atualizados
 */
export default class BaseContextUpdater {
  /**
   * @description Será chamada quando os dados locais forem alterados
   **/
  protected callback?: () => void

  /**
   * @description Adicionar a função de atualização de dados
   * do ContextṔrovider
   */
  setCallback = (callback: () => void) => {
    this.callback = callback
  }

  /**
   * @description Atualiza o contexto pelo callback
   */
  update: () => void = () => {
    if (this.callback) {
      this.callback()
    }
  }
}
