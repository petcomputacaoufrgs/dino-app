class EventsServiceWithoutLanguageContextError extends Error {
  constructor() {
    super('Using EventService before start without LanguageContext.')
    this.name = 'EventsServiceWithoutLanguageContextError'
  }
}

export default EventsServiceWithoutLanguageContextError
