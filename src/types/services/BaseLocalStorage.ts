/**
 * @description
 * - Auxilia a gravar e ler valores do local storage
 * Quando o objeto não for uma string é necessário o JSON stringify caso contrário
 * não é possível acessar os dados.
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
  ): string => (nullableString ? nullableString : '')
}
