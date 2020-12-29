import Database from "../Database"
import AuthEntity from '../../../types/auth/database/AuthEntity'

class AuthRepository {
    private table = Database.auth

    async getFirst(): Promise<AuthEntity | undefined> {
        const all = await this.table.toArray()
        
        if (all.length > 0) {
            return all[0]
        }
    }
    
    async save(entity: AuthEntity) {
        const id = await this.table.put(entity)
        
        entity.id = id
    }
    
    async clear() {
        return this.table.clear()
    }

}

export default new AuthRepository()