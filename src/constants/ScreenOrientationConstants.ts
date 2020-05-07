/**
 * @description Valor dos estados de orientação da tela
 */
class ScreenOrientationConstants {
  /**
   * @description Valor para tela na horizontal
   */
  LANDSCAPE: string = 'landscape-primary'

  /**
   * @description Valor para tela na horizontal de cabeça para baixo
   */
  LANDSCAPE_UPSIDE_DOWN: string = 'landscape-secondary'

  /**
   * @description Valor para tela na vertical
   */
  PORTRAIT: string = 'portrait-primary'

  /**
   * @description Valor para tela na vertical de cabeça para baixo
   */
  PORTRAIT_UPSIDE_DOWN: string = 'portrait-secondary'

  /**
   * @description Valor para quando o browser não suportar este recurso
   */
  NOT_SUPPORTED: string | undefined = undefined
}

export default new ScreenOrientationConstants()
