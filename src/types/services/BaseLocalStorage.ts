/**
 * @description Define uma base para gravar e ler dados do LocalStorage
 * Atenção: Quando o objeto não for uma string é necessário utilizar JSON.stringify
 * para codificação e JSON.parse para realizar a leitura.
 * */
export default class BaseLocalStorage {
  protected get = (key: string): string | null => localStorage.getItem(key)

  protected set = (key: string, value: string) => {
    if (!key) {
      throw Error('Chave inválida!')
    } else {
      return localStorage.setItem(key, value)
    }
  }

  protected remove = (key: string) => {
    if (!key) {
      throw Error('Chave inválida!')
    } else {
      return localStorage.removeItem(key)
    }
  }

  protected convertStringOrNullToString = (
    nullableString: string | null
  ): string => (nullableString || '')
}
