import LogAppErrorModel from '../types/log_app_error/LogAppErrorModel'

export default class LogAppModelError extends Error {
  constructor(model: LogAppErrorModel) {
    super(`Model without date or error. Model: ${JSON.stringify(model)}`)
  }
}