export default class NoteColumnEditError extends Error {
  constructor() {
    super(`Order or Column is needed to create or edit a column.`)
  }
}
