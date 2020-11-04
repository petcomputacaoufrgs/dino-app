import DinoDatabase from '../DinoDatabase'
import LogAppErrorEntity from '../../../types/log_app_error/database/LogAppErrorEntity'

class LogAppErrorDatabase {
    private database = DinoDatabase.logAppError

    async getAll(): Promise<LogAppErrorEntity[]> {
        return this.database.toArray()
    }

    async put(entity: LogAppErrorEntity) {
        const id = await this.database.put(entity)

        entity.id = id
    }

    async deleteAll() {
        console.log("clear")
        return this.database.clear()
    }
}

export default new LogAppErrorDatabase()