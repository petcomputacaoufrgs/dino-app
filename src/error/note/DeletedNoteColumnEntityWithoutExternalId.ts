export default class DeletedNoteColumnEntityWithoutExternalId extends Error {
  constructor() {
    super('Trying to create DeletedNoteColumnEntity without a external id')
  }
}
