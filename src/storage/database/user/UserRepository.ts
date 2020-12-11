import UserEntity from "../../../types/user/database/UserEntity"
import Database from "../Database"
import SynchronizableRepository from "../synchronizable/SynchronizableRepository"

export class UserRepositoryImpl extends SynchronizableRepository<
  number,
  number,
  UserEntity
> {
  getById = async (id: number): Promise<UserEntity | undefined> => {
    return this.table.where('id').equals(id).first()
  }

  getByLocalId = async (localId: number): Promise<UserEntity | undefined> => {
    return this.table.where('localId').equals(localId).first()
  }

  getFirst = async (): Promise<UserEntity | undefined> => {
    const entites = await this.table.toArray()
    return entites.length > 0 ? entites[0] : undefined
  }
}

export default new UserRepositoryImpl(Database.user)
