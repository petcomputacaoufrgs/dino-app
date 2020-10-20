export default class ViewAddNoteOpenedWIthoutColumnError extends Error {
  constructor() {
    super(`Column is needed to add new note`)
  }
}
