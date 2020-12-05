import Database from '../Database'
import LogAppErrorEntity from '../../../types/log_app_error/database/LogAppErrorEntity'

class LogAppErrorRepository {
  private table = Database.logAppError

  async getAll(): Promise<LogAppErrorEntity[]> {
    return this.table.toArray()
  }

  async put(entity: LogAppErrorEntity) {
    const id = await this.table.put(entity)

    entity.id = id
  }

  async deleteAll() {
    return this.table.clear()
  }
}

export default new LogAppErrorRepository()
