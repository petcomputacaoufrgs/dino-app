/**
 * @description Service utilizada para atualizar dados de contexto da provider
 * quando os dados locais forem atualizados pela API ou por outro meio externo.
 */
export default class BaseContextUpdater {
  /**
   * @description Adicionar a função do contexto para a service
   */
  setCallback = (callback: () => void) => {
    this.onLocalDataChange = callback
  }

  /**
   * @description Será chamada quando os dados locais forem alterados
   * Atenção: Deve ser definida pela função start na provider
   **/
  protected onLocalDataChange?: () => void

  /**
   * @description Atualiza o contexto
   */
  update: () => void = () => {
    if (this.onLocalDataChange) {
      this.onLocalDataChange()
    }
  }
}
