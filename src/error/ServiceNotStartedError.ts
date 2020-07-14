class ServiceNotStartedError extends Error {
  constructor() {
    super('Using a Service without use start function.')
    this.name = 'ServiceNotStartedError'
  }
}

export default ServiceNotStartedError
