export default class LocalStorageEmpyKeyError extends Error {
  constructor() {
    super(
      'Chave vazia ao tentar salvar ou buscar dado no LocalStorage'
    )
  }
}
