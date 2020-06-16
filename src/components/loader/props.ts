/**
 * @description Propriedades do loader
 */
export default class LoaderProps {
  /**
   * @description Define se o loader está ativo ou não
   */
  loading: boolean

  /**
   * @description Define um alt para a imagem do loader
   */
  alt?: string

  /**
   *
   * @param loading Define se o loader está ativo ou não
   */
  constructor(loading: boolean, alt?: string) {
    this.loading = loading
    this.alt = alt
  }
}
