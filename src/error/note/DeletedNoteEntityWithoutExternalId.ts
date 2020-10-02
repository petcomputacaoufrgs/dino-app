export default class DeletedNoteEntityWithoutExternalId extends Error {
    constructor() {
        super('Trying to create DeletedNoteEntity without a external id')
    }
}
